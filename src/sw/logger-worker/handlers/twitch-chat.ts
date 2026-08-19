/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Emotes, Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

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
          const emotes = data.payload.event.message?.fragments
            ?.filter((fragment: any) => fragment.type === "emote")
            .map((fragment: any) => {
              const id = fragment.emote.id;
              const url = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/static/light/1.0`;
              return {
                type: "twitch",
                name: fragment.text,
                id: fragment.emote.id,
                gif: false,
                urls: { "1": url },
                start: 0,
                end: 0,
              } as Emotes;
            });
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
              name: "emotes",
              value: emotes,
              type: "object",
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
    reportStarted("Twitch");
  });

  websocketClient.addEventListener("close", (event) => {
    if (event.code === 1000) return;
    reportError(
      "Twitch",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
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
  emotesStore: EmotesStore,
): void {
  console.log({ connected: connectedTokens }, "add twitch-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((token) => token.system === "Twitch")
      .filter((token) => !connectedTokens.includes(token.id))
      .forEach((token) => {
        console.log(`add handler for ${token.id}`);
        connectedTokens.push(token.id);
        recipientService
          .getAccessToken({ tokenId: token.id }, auth)
          .then((response) =>
            startWebSocketClient(response.data.token, eventbus),
          );
      });
  });
}
