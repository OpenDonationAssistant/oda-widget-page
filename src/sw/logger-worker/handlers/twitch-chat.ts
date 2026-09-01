/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";
import { emotesFromText } from "./emotes";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

interface BadgeDef {
  type: string;
  version: string;
  url: string;
  description: string;
}

const badgeDefinitions = new Map<string, Map<string, BadgeDef>>();

async function fetchBadgeDefinitions(
  token: string,
  broadcasterId: string,
): Promise<Map<string, BadgeDef>> {
  const headers = {
    Authorization: "Bearer " + token,
    "Client-Id": "2f9aljaudj3678kp4gc9bj99tb7bev",
  };
  const badgeMap = new Map<string, BadgeDef>();
  const endpoints = [
    `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcasterId}`,
    "https://api.twitch.tv/helix/chat/badges/global",
  ];
  for (const url of endpoints) {
    try {
      const response = await fetch(url, { headers });
      if (response.status !== 200) continue;
      const json = await response.json();
      for (const set of json.data ?? []) {
        for (const version of set.versions ?? []) {
          badgeMap.set(`${set.set_id}/${version.id}`, {
            type: set.set_id,
            version: version.id,
            url: version.image_url_4x,
            description: version.title,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch Twitch badges", error);
    }
  }
  return badgeMap;
}

async function registerEventSubListeners(
  websocketSessionID: string,
  token: string,
  twitchId: string,
) {
  // Register channel.chat.message
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
          broadcaster_user_id: twitchId,
          user_id: twitchId,
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
  badgeDefinitions.set(token, await fetchBadgeDefinitions(token, twitchId));
}

function handleWebSocketMessage(
  token: string,
  twitchId: string,
  data: any,
  eventbus: EventBus,
  emotesStore: EmotesStore,
) {
  switch (data.metadata.message_type) {
    case "session_welcome":
      registerEventSubListeners(data.payload.session.id, token, twitchId);
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
          const badges: BadgeDef[] = (data.payload.event.badges ?? [])
            .map((badge: { set_id: string; id: string }) =>
              badgeDefinitions.get(token)?.get(`${badge.set_id}/${badge.id}`),
            )
            .filter((badge: BadgeDef | undefined): badge is BadgeDef =>
              Boolean(badge),
            );
          let role = "viewer";
          let isSubscriber = false;
          if (
            badges.filter((it: BadgeDef) => it.type === "broadcaster").length >
            0
          ) {
            role = "broadcaster";
          }
          if (
            badges.filter((it: BadgeDef) => it.type === "lead_moderator")
              .length > 0
          ) {
            role = "lead_moderator";
          }
          if (
            badges.filter((it: BadgeDef) => it.type === "moderator").length > 0
          ) {
            role = "moderator";
          }
          if (
            badges.filter((it: BadgeDef) => it.type === "subscriber").length > 0
          ) {
            isSubscriber = true;
          }
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
              value: data.payload.event.chatter_user_name ?? "",
              type: "string",
            },
            {
              id: uuidv7(),
              name: "chatter_color",
              value: data.payload.event.color ?? "#000000",
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
              value: badges,
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
  twitchId: string,
  token: string,
  eventbus: EventBus,
  emotesStore: EmotesStore,
) {
  console.log({ twitchId: twitchId }, "Starting Twitch WebSocket connection");
  let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

  websocketClient.addEventListener("error", console.error);

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
    reportStarted(odaToken, "Twitch");
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
    handleWebSocketMessage(
      token,
      twitchId,
      JSON.parse(data.data),
      eventbus,
      emotesStore,
    );
  });

  websocketClients.add(websocketClient);

  return websocketClient;
}

const recipientService = RecipientService(undefined, "https://api.oda.digital");

let connectedTokens: string[] = [];
const websocketClients = new Set<WebSocket>();

export function register(
  odaToken: string,
  recipientId: string,
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
                token.settings.id,
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
