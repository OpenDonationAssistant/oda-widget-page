/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";
import { emotesFromText } from "./emotes";

const VKLIVE_WEBSOCKET_URL =
  "wss://pubsub-dev.live.vkvideo.ru/connection/websocket?cf_protocol_version=v2";
const VKLIVE_API_URL = "https://apidev.live.vkvideo.ru";

/** Channel URL slug to listen to (hardcoded). */
const VK_CHANNEL_URL = "stcarolas";

const EVENT_NAME = "VKLIVE_CHAT_MESSAGE";

async function getJson(url: string, token: string): Promise<any> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    console.error(
      "VK Live API call failed with status code " +
        response.status +
        ": " +
        url,
    );
  }
  return response.json();
}

async function getChatChannelName(token: string): Promise<string> {
  const json = await getJson(
    `${VKLIVE_API_URL}/v1/channel?channel_url=${encodeURIComponent(VK_CHANNEL_URL)}`,
    token,
  );
  return json.data.channel.web_socket_channels.chat;
}

async function getConnectionToken(token: string): Promise<string> {
  const json = await getJson(`${VKLIVE_API_URL}/v1/websocket/token`, token);
  return json.data.token;
}

async function getSubscriptionToken(
  token: string,
  channel: string,
): Promise<string> {
  const json = await getJson(
    `${VKLIVE_API_URL}/v1/websocket/subscription_token?channels=${encodeURIComponent(channel)}`,
    token,
  );
  const entry = json.data.channel_tokens.find(
    (it: { channel: string }) => it.channel === channel,
  );
  return entry?.token ?? "";
}

function messageText(message: any): string {
  const parts: any[] = message.parts ?? [];
  return parts
    .map((part) => part.text?.content ?? part.smile?.name ?? "")
    .join(" ");
}

function handleChatMessage(
  message: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.debug({ message }, "VK Live chat message");
  const emotes = emotesFromText(messageText(message), emotesStore);
  emotes.push(
    ...(message.parts ?? [])
      .filter((part: any) => part.smile)
      .map((part: any) => {
        return {
          type: "vklive",
          name: part.smile.name,
          id: part.smile.id,
          gif: part.smile.animated,
          urls: {
            "1": part.smile.medium_url,
            "2": part.smile.medium_url,
            "4": part.smile.medium_url,
          },
          start: 0,
          end: 0,
        };
      }),
  );
  const variables: Variable[] = [
    {
      id: uuidv7(),
      name: "chatter_user_login",
      value: `<span class="oda-message-author"><img height="16" width="16" src="https://dev.live.vkvideo.ru/static/favicon.png"/><span>${message.author?.nick ?? ""}</span></span>`,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_text",
      value: messageText(message),
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

function handleChatData(
  data: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.log({ data }, "VKLive chat data");
  const message = data?.data?.chat_message;
  console.log({ message }, "VK Live chat message");
  if (!message) return;
  handleChatMessage(message, eventbus, emotesStore);
}

function handleFrame(
  frame: any,
  channel: string,
  subscriptionToken: string,
  websocketClient: WebSocket,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.log({ frame }, "VK Live WebSocket frame");
  if (frame.id === 1 && frame.connect) {
    websocketClient.send(
      JSON.stringify({
        id: 2,
        subscribe: { channel, token: subscriptionToken },
      }),
    );
  } else if (frame.id === 2 && frame.subscribe) {
    console.log(`Subscribed to VK Live channel [${channel}]`);
  } else if (frame.push) {
    handleChatData(frame.push.pub?.data, eventbus, emotesStore);
  } else if (Object.keys(frame).length === 0) {
    websocketClient.send("{}"); // pong
  }
}

function startWebSocketClient(
  odaToken: string,
  channel: string,
  connectionToken: string,
  subscriptionToken: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): WebSocket {
  console.log({ channel }, "Starting VK Live WebSocket connection");
  const websocketClient = new WebSocket(VKLIVE_WEBSOCKET_URL);

  websocketClient.addEventListener("error", console.error);

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + VKLIVE_WEBSOCKET_URL);
    reportStarted("VKLive");
    websocketClient.send(
      JSON.stringify({ id: 1, connect: { token: connectionToken } }),
    );
  });

  websocketClient.addEventListener("close", (event) => {
    if (event.code === 1000) return;
    reportError(
      odaToken,
      "VKLive",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
  });

  websocketClient.addEventListener("message", (data) => {
    const frames = (data.data as string)
      .split("\n")
      .filter((frame) => frame.trim() !== "");
    frames.forEach((frame) =>
      handleFrame(
        JSON.parse(frame),
        channel,
        subscriptionToken,
        websocketClient,
        eventbus,
        emotesStore,
      ),
    );
  });

  websocketClients.add(websocketClient);

  return websocketClient;
}

async function startVKLiveClient(
  token: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
) {
  try {
    const channel = await getChatChannelName(token);
    const [connectionToken, subscriptionToken] = await Promise.all([
      getConnectionToken(token),
      getSubscriptionToken(token, channel),
    ]);
    startWebSocketClient(
      token,
      channel,
      connectionToken,
      subscriptionToken,
      eventbus,
      emotesStore,
    );
  } catch (error) {
    console.error("Failed to start VK Live chat client", error);
  }
}

const recipientService = RecipientService(undefined, "https://api.oda.digital");

let connectedTokens: string[] = [];
const websocketClients = new Set<WebSocket>();

export function register(
  odaToken: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.log({ connected: connectedTokens }, "add vklive-listener");
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((token) => token.system === "VKLive")
        .filter((token) => !connectedTokens.includes(token.id))
        .forEach((token) => {
          console.log(`add handler for ${token.id}`);
          connectedTokens.push(token.id);
          recipientService
            .getAccessToken({ tokenId: token.id }, auth)
            .then((response) =>
              startVKLiveClient(response.data.token, eventbus, emotesStore),
            );
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to VKLive", err);
      reportError(odaToken, "VKLive", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove vklive-listener");
  websocketClients.forEach((websocketClient) => {
    websocketClient.close(1000, "deregistered");
    websocketClients.delete(websocketClient);
  });
  connectedTokens = [];
}
