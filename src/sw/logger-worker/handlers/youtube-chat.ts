/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";
import { emotesFromText } from "./emotes";
import type { TokenDto } from "../systems";
import { log } from "./log";

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";
const RECONNECT_DELAY_MS = 1000;
const MAX_RESULTS = 500;

const EVENT_NAME = "YOUTUBE_CHAT_MESSAGE";
const HANDLER_NAME = "Youtube";

// Endpoint comes from the build-time environment, with a fallback to the
// production gateway.
const RECIPIENT_API_ENDPOINT =
  process.env.REACT_APP_RECIPIENT_API_ENDPOINT ?? "https://api.oda.digital";

const recipientService = RecipientService(undefined, RECIPIENT_API_ENDPOINT);

let connectedTokens: string[] = [];
const clients = new Set<{ stop: () => void }>();

// Find the id of the channel's currently live video, if any.
async function findLiveVideoId(
  apiKey: string,
  channelId: string,
): Promise<string | null> {
  const url =
    `${YOUTUBE_API_URL}/search?part=id&type=video&eventType=live` +
    `&channelId=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const json = await response.json();
  return json.items?.[0]?.id?.videoId ?? null;
}

// Resolve the live chat id for a live video.
async function getLiveChatId(
  apiKey: string,
  videoId: string,
): Promise<string | null> {
  const url =
    `${YOUTUBE_API_URL}/videos?part=liveStreamingDetails` +
    `&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const json = await response.json();
  return json.items?.[0]?.liveStreamingDetails?.activeLiveChatId ?? null;
}

// Read a server-streaming response. Each line is a complete
// liveChatMessageListResponse JSON object pushed by the server.
async function readStream(
  odaToken: string,
  response: Response,
  onResponse: (json: any) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    let result: ReadableStreamReadResult<Uint8Array>;
    try {
      result = await reader.read();
    } catch {
      // Aborted (deregister) or stream error — stop reading.
      break;
    }
    if (result.done) break;
    buffer += decoder.decode(result.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        onResponse(JSON.parse(trimmed));
      } catch (error) {
        reportError(
          odaToken,
          HANDLER_NAME,
          `Failed to parse YouTube stream message: ${error}`,
        );
      }
    }
  }
}

function handleChatMessage(
  message: any,
  broadcasterChannelId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  const snippet = message.snippet ?? {};
  const author = message.authorDetails ?? {};
  const text = snippet.displayMessage ?? "";
  // YouTube custom emoji are not resolvable through a plain API key, so only
  // the shared emote dictionary lookup is applied.
  const emotes = emotesFromText(text, emotesStore);
  let role = "viewer";
  if (author.isChatOwner) role = "owner";
  else if (author.isChatModerator) role = "moderator";
  const isSubscriber = Boolean(author.isChatSponsor);
  const variables: Variable[] = [
    {
      id: uuidv7(),
      name: "broadcaster_user_login",
      value: broadcasterChannelId,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "chatter_user_login",
      value: author.displayName ?? "",
      type: "string",
    },
    {
      id: uuidv7(),
      name: "chatter_color",
      value: "",
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_text",
      value: text,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_id",
      value: String(message.id ?? ""),
      type: "string",
    },
    {
      id: uuidv7(),
      name: "emotes",
      value: emotes,
      type: "object",
    },
    {
      id: uuidv7(),
      name: "badges",
      value: [],
      type: "object",
    },
    {
      id: uuidv7(),
      name: "role",
      value: role,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "isSubscriber",
      value: isSubscriber,
      type: "boolean",
    },
  ];
  eventbus.push(new Event(EVENT_NAME, variables));
}

// Open a server-streaming connection to the live chat, rediscovering the live
// video whenever the stream ends, changes, or the current live chat id becomes
// invalid. Reconnects resume from the last nextPageToken.
function startYoutubeChat(
  odaToken: string,
  channelId: string,
  apiKey: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): { stop: () => void } {
  let stopped = false;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let abortController: AbortController | undefined;
  let pageToken: string | undefined;

  const scheduleRetry = (): void => {
    if (stopped) return;
    if (retryTimer !== undefined) clearTimeout(retryTimer);
    retryTimer = setTimeout(() => {
      run();
    }, RECONNECT_DELAY_MS);
  };

  const openStream = async (liveChatId: string): Promise<void> => {
    let url =
      `${YOUTUBE_API_URL}/liveChat/messages/streamList?part=snippet,authorDetails` +
      `&liveChatId=${encodeURIComponent(liveChatId)}&maxResults=${MAX_RESULTS}` +
      `&key=${encodeURIComponent(apiKey)}`;
    if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;
    abortController = new AbortController();
    const response = await fetch(url, { signal: abortController.signal });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const reason =
        body?.error?.errors?.[0]?.reason ??
        body?.error?.message ??
        response.status;
      reportError(
        odaToken,
        HANDLER_NAME,
        `YouTube streamList failed: ${reason}`,
      );
      // A dead or ended chat means the live video changed — drop the resume
      // token so the next attempt re-detects the live video.
      pageToken = undefined;
      return;
    }
    await readStream(odaToken, response, (json) => {
      if (json.offlineAt) {
        // Stream went offline — stop and re-detect the live video.
        pageToken = undefined;
        return;
      }
      if (json.nextPageToken) pageToken = json.nextPageToken;
      for (const item of json.items ?? []) {
        if (item.snippet?.type !== "textMessageEvent") continue;
        if (item.snippet?.hasDisplayContent === false) continue;
        handleChatMessage(item, channelId, eventbus, emotesStore);
      }
    });
  };

  const run = async (): Promise<void> => {
    if (stopped) return;
    try {
      const videoId = await findLiveVideoId(apiKey, channelId);
      if (stopped) return;
      if (!videoId) {
        // No live stream right now — try again later.
        pageToken = undefined;
        scheduleRetry();
        return;
      }
      const liveChatId = await getLiveChatId(apiKey, videoId);
      if (stopped) return;
      if (!liveChatId) {
        pageToken = undefined;
        scheduleRetry();
        return;
      }
      reportStarted(odaToken, HANDLER_NAME);
      await openStream(liveChatId);
      // Stream closed (ended or error) — reconnect, resuming from the last
      // page token when the chat is still alive.
      scheduleRetry();
    } catch (error) {
      if (stopped) return;
      reportError(
        odaToken,
        HANDLER_NAME,
        `Failed to start YouTube chat client: ${error}`,
      );
      scheduleRetry();
    }
  };

  run();

  return {
    stop: (): void => {
      stopped = true;
      if (retryTimer !== undefined) clearTimeout(retryTimer);
      abortController?.abort();
    },
  };
}

export function register(
  odaToken: string,
  recipientId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
  tokens: TokenDto[] | null,
): void {
  if (!tokens) {
    reportError(odaToken, HANDLER_NAME, "Failed to fetch recipient tokens");
    return;
  }
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  tokens
    .filter((token) => token.system === "GoogleApiKey")
    .filter((token) => !connectedTokens.includes(token.id))
    .forEach((token) => {
      log("INFO", `add youtube handler for ${token.id}`);
      connectedTokens.push(token.id);
      recipientService
        .getAccessToken({ tokenId: token.id }, auth)
        .then((response) => {
          const channelId = String(token.settings?.["channelId"] ?? "");
          if (!channelId) {
            reportError(
              odaToken,
              HANDLER_NAME,
              "GoogleApiKey token is missing a channelId setting",
            );
            return;
          }
          clients.add(
            startYoutubeChat(
              odaToken,
              channelId,
              response.data.token,
              eventbus,
              emotesStore,
            ),
          );
        })
        .catch((err) => {
          reportError(odaToken, HANDLER_NAME, String(err));
        });
    });
}

export function deregister(): void {
  log("INFO", { connected: connectedTokens }, "remove youtube-listener");
  clients.forEach((client) => client.stop());
  clients.clear();
  connectedTokens = [];
}

