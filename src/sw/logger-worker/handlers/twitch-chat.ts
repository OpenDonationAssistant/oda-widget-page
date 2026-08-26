/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";
import { emotesFromText } from "./emotes";

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

function handleWebSocketMessage(
  token: string,
  data: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
) {
  switch (data.metadata.message_type) {
    case "session_welcome":
      registerEventSubListeners(data.payload.session.id, token);
      break;
    case "notification":
      switch (data.metadata.subscription_type) {
        case "channel.chat.message":
          console.log("data.payload.event", data.payload.event);
          const emotes = emotesFromText(
            data.payload.event.message?.text ?? "",
            emotesStore,
          );
          emotes.push(
            ...(data.payload.event.message?.fragments ?? [])
              .filter((fragment) => fragment.type === "emote")
              .map((fragment) => {
                const link = `https://static-cdn.jtvnw.net/emoticons/v2/${fragment.emote.id}/default/dark/1.0`;
                return {
                  type: "twitch",
                  name: fragment.text,
                  id: fragment.emote.id,
                  gif: false,
                  urls: { "1": link, "2": link, "4": link },
                  start: 0,
                  end: 0,
                };
              }),
          );
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
              value: `<span class="oda-message-author"><img height="16" width="16" src="https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png"/><span>${data.payload.event.chatter_user_name ?? ""}</span></span>`,
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

function startWebSocketClient(
  odaToken: string,
  token: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
) {
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
      odaToken,
      "Twitch",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
  });

  websocketClient.addEventListener("message", (data) => {
    handleWebSocketMessage(token, JSON.parse(data.data), eventbus, emotesStore);
  });

  websocketClients.add(websocketClient);

  return websocketClient;
}

const recipientService = RecipientService(undefined, "https://api.oda.digital");

let connectedTokens: string[] = [];
const websocketClients = new Set<WebSocket>();

export function register(
  odaToken: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
): void {
  console.log({ connected: connectedTokens }, "add twitch-listener");
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((token) => token.system === "Twitch")
        .filter((token) => !connectedTokens.includes(token.id))
        .forEach((token) => {
          console.log(`add handler for ${token.id}`);
          connectedTokens.push(token.id);
          recipientService
            .getAccessToken({ tokenId: token.id }, auth)
            .then((response) =>
              startWebSocketClient(
                odaToken,
                response.data.token,
                eventbus,
                emotesStore,
              ),
            );
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to Twitch", err);
      reportError(odaToken, "Twitch", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove twitch-listener");
  websocketClients.forEach((websocketClient) => {
    websocketClient.close(1000, "deregistered");
    websocketClients.delete(websocketClient);
  });
  connectedTokens = [];
}
