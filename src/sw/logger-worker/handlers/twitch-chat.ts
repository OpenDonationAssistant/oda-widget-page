/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";

const swScope = self as unknown as ServiceWorkerGlobalScope;
const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

async function sendMessage(msg: any) {
  const clients = await swScope.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clients) {
    client.postMessage(msg);
  }
}

async function getTwitchUserId(token: string) {
  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    headers: {
      Authorization: "OAuth " + token,
    },
  });
  const json = await response.json();
  return json.user_id;
}

async function registerEventSubListeners(
  websocketSessionID: string,
  token: string,
) {
  // Register channel.chat.message
  let userId = await getTwitchUserId(token);
  let response = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Client-Id": "2f9aljaudj3678kp4gc9bj99tb7bev",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.chat.message",
        version: "1",
        condition: {
          broadcaster_user_id: userId,
          user_id: userId,
        },
        transport: {
          method: "websocket",
          session_id: websocketSessionID,
        },
      }),
    },
  );

  if (response.status != 202) {
    let data = await response.json();
    console.error(
      "Failed to subscribe to channel.chat.message. API call returned status code " +
        response.status,
    );
    console.error(data);
  } else {
    const data = await response.json();
    console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
  }
}

function handleWebSocketMessage(token: string, data: any, eventbus: EventBus) {
  switch (data.metadata.message_type) {
    case "session_welcome":
      registerEventSubListeners(data.payload.session.id, token);
      break;
    case "notification":
      switch (data.metadata.subscription_type) {
        case "channel.chat.message":
          console.log("data.payload.event", data.payload.event);
          const variables: Variable[] = [];
          variables.push(
            {
              id: uuidv7(),
              name: "broadcaster_user_login",
              value: data.payload.event.broadcaster_user_login,
              type: "string",
            },
            {
              id: uuidv7(),
              name: "chatter_user_login",
              value: data.payload.event.chatter_user_login,
              type: "string",
            },
            {
              id: uuidv7(),
              name: "message_text",
              value: data.payload.event.message.text,
              type: "string",
            },
          );
          eventbus.push(new Event("TWITCH_CHAT_MESSAGE", variables));
          break;
      }
      break;
  }
}

function startWebSocketClient(token: string, eventbus: EventBus) {
  console.log({ token }, "Starting WebSocket connection");
  let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

  websocketClient.addEventListener("error", console.error);

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
  });

  websocketClient.addEventListener("message", (data) => {
    handleWebSocketMessage(token, JSON.parse(data.data), eventbus);
  });

  return websocketClient;
}

const recipientService = RecipientService(undefined, "https://api.oda.digital");

const connectedTokens: string[] = [];

export function register(
  token: string,
  eventbus: EventBus,
  sw: ServiceWorkerGlobalScope,
): void {
  console.log({ connected: connectedTokens },"add twitch-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((token) => token.system === "Twitch")
      .filter((token) => !connectedTokens.includes(token.id))
      .forEach((token) => {
        console.log(`add handler for ${token.id}`);
        connectedTokens.push(token.id);
        recipientService
          .getAccessToken({ refreshTokenId: token.id }, auth)
          .then((response) =>
            startWebSocketClient(response.data.token, eventbus),
          );
      });
  });
}
