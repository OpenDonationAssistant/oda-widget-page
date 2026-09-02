/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { getChannelInfo } from "@opendonationassistant/kick-service";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { reportError, reportStarted } from "../worker-status";
import { EmotesStore } from "../../../stores/EmotesStore";
import { emotesFromText } from "./emotes";

// Kick uses Pusher for its chat websocket. The app key and query params
// (protocol, client, version) below match what kick-js uses.
const KICK_PUSHER_WEBSOCKET_URL =
  "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false";
const RECONNECT_DELAY_MS = 1000;

const EVENT_NAME = "KICK_CHAT_MESSAGE";

// Endpoints come from the build-time environment (.env.development /
// .env.production), with a fallback to the production gateway.
const RECIPIENT_API_ENDPOINT =
  process.env.REACT_APP_RECIPIENT_API_ENDPOINT ?? "https://api.oda.digital";
const KICK_API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ?? "https://api.oda.digital";

const recipientService = RecipientService(undefined, RECIPIENT_API_ENDPOINT);

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
  frame: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  switch (frame.event) {
    case "App\\Events\\ChatMessageEvent": {
      let data = frame.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (error) {
          console.error("Kick: failed to parse chat message data", error);
          return;
        }
      }
      handleChatMessage(data, eventbus, emotesStore);
      break;
    }
    default:
      console.log("Kick: unsupported event type", frame.event);
  }
}

function startWebSocketClient(
  odaToken: string,
  chatroomId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): WebSocket {
  const channel = `chatrooms.${chatroomId}.v2`;
  console.log({ chatroomId }, "Starting Kick WebSocket connection");
  const websocketClient = new WebSocket(KICK_PUSHER_WEBSOCKET_URL);
  let reconnecting = false;
  websocketClients.add(websocketClient);

  // Reconnect on abnormal close/error. Guarded so error + close firing
  // together only schedule one reconnect.
  const scheduleReconnect = (): void => {
    if (reconnecting) return;
    reconnecting = true;
    setTimeout(() => {
      startWebSocketClient(odaToken, chatroomId, eventbus, emotesStore);
    }, RECONNECT_DELAY_MS);
  };

  websocketClient.addEventListener("error", (err) => {
    console.error("Kick WebSocket error:", err);
    scheduleReconnect();
  });

  websocketClient.addEventListener("open", () => {
    console.log(
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
    reportError(
      odaToken,
      "Kick",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
    if (!wasRegistered) return; // Closed by deregister — do not reconnect.
    console.log(
      `Kick WebSocket closed. Reconnection attempt in ${RECONNECT_DELAY_MS}ms`,
    );
    scheduleReconnect();
  });

  websocketClient.addEventListener("message", (data) => {
    let frame: any;
    try {
      frame = JSON.parse(data.data);
    } catch (error) {
      console.error("Kick: failed to parse WebSocket message", error);
      return;
    }
    handleFrame(frame, eventbus, emotesStore);
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
      console.error("Failed to get Kick channel info", { data, error });
      reportError(odaToken, "Kick", error?.message ?? "Failed to get Kick channel info");
      return;
    }
    startWebSocketClient(odaToken, data.chatroom.id, eventbus, emotesStore);
  } catch (error) {
    console.error("Failed to start Kick chat client", error);
    reportError(odaToken, "Kick", String(error));
  }
}

export function register(
  odaToken: string,
  recipientId: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.log({ connected: connectedTokens }, "add kick-chat listener");
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      console.log({ tokens }, "kick list tokens response");
      tokens.data
        .filter((token) => token.system === "Kick")
        .filter((token) => !connectedTokens.includes(token.id))
        .forEach((token) => {
          console.log(`add kick-chat handler for ${token.id}`);
          connectedTokens.push(token.id);
          startKickClient(odaToken, token.id, auth.headers, eventbus, emotesStore);
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to Kick", err);
      reportError(odaToken, "Kick", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove kick-chat listener");
  websocketClients.forEach((websocketClient) => {
    websocketClient.close(1000, "deregistered");
    websocketClients.delete(websocketClient);
  });
  connectedTokens = [];
}
