/// <reference lib="webworker" />

import { getChannelInfo } from "@opendonationassistant/kick-service";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { reportError, reportStarted } from "../worker-status";
import { EmotesStore } from "../../../stores/EmotesStore";
import { emotesFromText } from "./emotes";
import type { TokenDto } from "../systems";
import { log } from "./log";

// Kick uses Pusher for its chat websocket. Kick rotated its public Pusher app
// key on 2026-10-17: the previous key (32cbd69e4b950bf97679) now answers every
// cluster with `pusher:error 4001 "not in this cluster"`. The key/cluster below
// are verified live and overridable at build time (esbuild inlines every
// REACT_APP_* var), so a future rotation is a config change rather than a code
// edit. The query params (protocol, client, version) match what kick-js uses.
const KICK_PUSHER_APP_KEY =
  process.env.REACT_APP_KICK_PUSHER_APP_KEY ?? "34bf7a0ff419a2a775b9";
const KICK_PUSHER_CLUSTER =
  process.env.REACT_APP_KICK_PUSHER_CLUSTER ?? "us2";
const KICK_PUSHER_WEBSOCKET_URL =
  `wss://ws-${KICK_PUSHER_CLUSTER}.pusher.com/app/${KICK_PUSHER_APP_KEY}` +
  "?protocol=7&client=js&version=8.4.0&flash=false";
const RECONNECT_DELAY_MS = 1000;

// Pusher error/close codes 4000-4099 mean the connection was closed by Pusher
// and reconnecting with the same parameters will not succeed (4001 = app key
// rotated/deleted). Retrying on a timer would just spam errors.
function isFatalPusherCode(code: number | undefined): boolean {
  return typeof code === "number" && code >= 4000 && code < 4100;
}

const EVENT_NAME = "KICK_CHAT_MESSAGE";

// Endpoints come from the build-time environment (.env.development /
// .env.production), with a fallback to the production gateway.
const KICK_API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ?? "https://api.oda.digital";

let connectedTokens: string[] = [];
const websocketClients = new Set<WebSocket>();

function handleChatMessage(
  message: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  const emotes = emotesFromText(message.content ?? "", emotesStore);
  emotes.push(
    ...((message.content ?? "").match(/\[emote:\d+:[^\]]+\]/g) ?? []).map(
      (emote: string) => {
        const parts = emote.split(":") ?? ["[", "", "]"];
        const link = `https://files.kick.com/emotes/${parts[1]}/fullsize`;
        return {
          type: "kick",
          name: parts[2].slice(0, -1),
          id: parts[1],
          gif: false,
          urls: { "1": link, "2": link, "4": link },
          start: 0,
          end: 0,
        };
      },
    ),
  );
  const variables: Variable[] = [
    {
      id: uuidv7(),
      name: "chatter_user_login",
      value: message.sender?.username ?? "",
      type: "string",
    },
    {
      id: uuidv7(),
      name: "chatter_color",
      value: message.sender?.identity?.color ?? "",
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_text",
      value:
        message.content?.replace(
          /\[emote:\d+:([^\]]+)\]/g,
          (_1: string, _2: string, _3: any) => " " + _2 + " ",
        ) ?? "",
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
  ];
  eventbus.push(new Event(EVENT_NAME, variables));
}

function handleFrame(
  odaToken: string,
  frame: any,
  websocketClient: WebSocket,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): boolean {
  switch (frame.event) {
    case "App\\Events\\ChatMessageEvent": {
      let data = frame.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (error) {
          log("ERROR", "Kick: failed to parse chat message data", error);
          reportError(odaToken, "Kick", `failed to parse chat message data: ${error}`);
          return false;
        }
      }
      handleChatMessage(data, eventbus, emotesStore);
      return false;
    }
    case "pusher:ping":
      // Pusher protocol >= 5 requires a pusher:pong reply; without it the
      // server closes the socket once activity_timeout (120s) elapses.
      websocketClient.send(JSON.stringify({ event: "pusher:pong", data: {} }));
      return false;
    case "pusher:connection_established":
      log("INFO", "Kick: pusher connection established");
      return false;
    case "pusher_internal:subscription_succeeded":
      log("INFO", "Kick: subscribed to chat channel");
      return false;
    case "pusher:error": {
      const data = (frame.data ?? {}) as { code?: number; message?: string };
      reportError(
        odaToken,
        "Kick",
        `pusher error ${data.code ?? "?"}: ${data.message ?? "unknown"}`,
      );
      // Fatal codes are reported here; the close handler then stays silent.
      return isFatalPusherCode(data.code);
    }
    default:
      log("INFO", "Kick: unsupported event type", frame.event);
      return false;
  }
}

function startWebSocketClient(
  odaToken: string,
  chatroomId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): WebSocket {
  const channel = `chatrooms.${chatroomId}.v2`;
  log("INFO", { chatroomId }, "Starting Kick WebSocket connection");
  const websocketClient = new WebSocket(KICK_PUSHER_WEBSOCKET_URL);
  let reconnecting = false;
  let fatal = false;
  websocketClients.add(websocketClient);

  // Reconnect on abnormal close/error. Guarded so error + close firing
  // together only schedule one reconnect. Skipped when Pusher reports a fatal
  // condition (4000-4099) — reconnecting unchanged cannot succeed.
  const scheduleReconnect = (): void => {
    if (reconnecting || fatal) return;
    reconnecting = true;
    setTimeout(() => {
      startWebSocketClient(odaToken, chatroomId, eventbus, emotesStore);
    }, RECONNECT_DELAY_MS);
  };

  websocketClient.addEventListener("error", (err) => {
    if (fatal) return;
    log("ERROR", "Kick WebSocket error:", err);
    reportError(odaToken, "Kick", `WebSocket error: ${err}`);
    scheduleReconnect();
  });

  websocketClient.addEventListener("open", () => {
    log("INFO",
      "Kick WebSocket connection opened to " + KICK_PUSHER_WEBSOCKET_URL,
    );
    reportStarted(odaToken, "Kick");
    const connect = JSON.stringify({
      event: "pusher:subscribe",
      data: { auth: "", channel },
    });
    websocketClient.send(connect);
  });

  websocketClient.addEventListener("close", (event) => {
    const wasRegistered = websocketClients.delete(websocketClient);
    if (event.code === 1000) return;
    // A pusher:error frame already reported this connection's failure.
    if (fatal) return;
    reportError(
      odaToken,
      "Kick",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
    if (isFatalPusherCode(event.code)) {
      fatal = true;
      return;
    }
    if (!wasRegistered) return; // Closed by deregister — do not reconnect.
    log("INFO",
      `Kick WebSocket closed. Reconnection attempt in ${RECONNECT_DELAY_MS}ms`,
    );
    scheduleReconnect();
  });

  websocketClient.addEventListener("message", (data) => {
    let frame: any;
    try {
      frame = JSON.parse(data.data);
    } catch (error) {
      log("ERROR", "Kick: failed to parse WebSocket message", error);
      reportError(odaToken, "Kick", `failed to parse WebSocket message: ${error}`);
      return;
    }
    if (handleFrame(odaToken, frame, websocketClient, eventbus, emotesStore)) {
      fatal = true;
    }
  });

  return websocketClient;
}

async function startKickClient(
  odaToken: string,
  tokenId: string,
  auth: { Authorization: string },
  eventbus: EventBus,
  emotesStore: EmotesStore,
): Promise<void> {
  try {
    const { data, error } = await getChannelInfo({
      baseURL: KICK_API_ENDPOINT,
      headers: auth,
      body: { tokenId },
    });
    if (error || !data?.chatroom?.id) {
      log("ERROR", "Failed to get Kick channel info", { data, error });
      const errorMessage =
        (error as { message?: string } | undefined)?.message ??
        "Failed to get Kick channel info";
      reportError(odaToken, "Kick", errorMessage);
      return;
    }
    startWebSocketClient(odaToken, data.chatroom.id, eventbus, emotesStore);
  } catch (error) {
    log("ERROR", "Failed to start Kick chat client", error);
    reportError(odaToken, "Kick", String(error));
  }
}

export function register(
  odaToken: string,
  recipientId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
  tokens: TokenDto[] | null,
): void {
  if (!tokens) {
    reportError(odaToken, "Kick", "Failed to fetch recipient tokens");
    return;
  }
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  tokens
    .filter((token) => token.system === "Kick")
    .filter((token) => !connectedTokens.includes(token.id))
    .forEach((token) => {
      log("INFO", `add kick-chat handler for ${token.id}`);
      connectedTokens.push(token.id);
      startKickClient(odaToken, token.id, auth.headers, eventbus, emotesStore);
    });
}

export function deregister(): void {
  log("INFO", { connected: connectedTokens }, "remove kick-chat listener");
  websocketClients.forEach((websocketClient) => {
    websocketClient.close(1000, "deregistered");
    websocketClients.delete(websocketClient);
  });
  connectedTokens = [];
}
