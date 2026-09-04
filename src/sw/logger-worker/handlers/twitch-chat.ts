/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { EmotesStore } from "../../../stores/EmotesStore";
import { reportError, reportStarted } from "../worker-status";
import { emotesFromText } from "./emotes";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";
const RECONNECT_DELAY_MS = 1000;
const SUBSCRIPTION_RETRY_DELAY_MS = 1000;
const SUBSCRIPTION_MAX_ATTEMPTS = 5;
const CLIENT_ID = "2f9aljaudj3678kp4gc9bj99tb7bev";

interface BadgeDef {
  type: string;
  version: string;
  url: string;
  description: string;
}

const badgeDefinitions = new Map<string, Map<string, BadgeDef>>();

async function fetchBadgeDefinitions(
  odaToken: string,
  token: string,
  broadcasterId: string,
): Promise<Map<string, BadgeDef>> {
  const headers = {
    Authorization: "Bearer " + token,
    "Client-Id": CLIENT_ID,
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
      reportError(
        odaToken,
        "Twitch",
        `Failed to fetch Twitch badges: ${error}`,
      );
    }
  }
  return badgeMap;
}

// List existing channel.chat.message subscriptions for this broadcaster.
async function listChatSubscriptions(
  odaToken: string,
  token: string,
  twitchId: string,
): Promise<any[]> {
  const headers = {
    Authorization: "Bearer " + token,
    "Client-Id": CLIENT_ID,
  };
  try {
    const response = await fetch(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      { headers },
    );
    if (response.status !== 200) return [];
    const json = await response.json();
    return (json.data ?? []).filter(
      (sub: any) =>
        sub.type === "channel.chat.message" &&
        sub.condition?.broadcaster_user_id === twitchId,
    );
  } catch (error) {
    reportError(
      odaToken,
      "Twitch",
      `Failed to list existing Twitch subscriptions: ${error}`,
    );
    return [];
  }
}

// Remove subscriptions left over from previous sessions so creating a fresh
// one cannot fail with 409 Conflict (which would leave the new session unused
// and cause Twitch to close it with code 4003).
async function deleteStaleSubscriptions(
  odaToken: string,
  token: string,
  twitchId: string,
  currentSessionId: string,
): Promise<void> {
  const headers = {
    Authorization: "Bearer " + token,
    "Client-Id": CLIENT_ID,
  };
  const subscriptions = await listChatSubscriptions(odaToken, token, twitchId);
  for (const sub of subscriptions) {
    if (sub.transport?.session_id === currentSessionId) continue;
    try {
      await fetch(
        `https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`,
        { method: "DELETE", headers },
      );
    } catch (error) {
      reportError(
        odaToken,
        "Twitch",
        `Failed to delete stale Twitch subscription: ${error}`,
      );
    }
  }
}

async function registerEventSubListeners(
  odaToken: string,
  websocketSessionID: string,
  token: string,
  twitchId: string,
): Promise<boolean> {
  const headers = {
    Authorization: "Bearer " + token,
    "Client-Id": CLIENT_ID,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
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
  });

  let response = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    { method: "POST", headers, body },
  );

  // 409 Conflict: a subscription for the same broadcaster already exists,
  // usually left over from a previous session. If it already belongs to this
  // session we are done; otherwise remove stale ones and retry once.
  if (response.status === 409) {
    const existing = await listChatSubscriptions(odaToken, token, twitchId);
    const alreadyOurs = existing.some(
      (sub) => sub.transport?.session_id === websocketSessionID,
    );
    if (alreadyOurs) {
      console.log(
        `Subscription already exists for session ${websocketSessionID}`,
      );
      badgeDefinitions.set(
        token,
        await fetchBadgeDefinitions(odaToken, token, twitchId),
      );
      return true;
    }
    await deleteStaleSubscriptions(
      odaToken,
      token,
      twitchId,
      websocketSessionID,
    );
    response = await fetch(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      { method: "POST", headers, body },
    );
  }

  if (response.status != 202) {
    reportError(
      odaToken,
      "Twitch",
      `Failed to subscribe to channel.chat.message. API call returned status code ${response.status}`,
    );
    return false;
  }
  const data = await response.json();
  console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
  badgeDefinitions.set(
    token,
    await fetchBadgeDefinitions(odaToken, token, twitchId),
  );
  return true;
}

// Keep retrying until the subscription is created. Twitch closes the socket
// with 4003 if no subscription exists within 10 seconds of connecting, so a
// transient failure must not leave the session unused.
async function registerEventSubListenersWithRetry(
  odaToken: string,
  websocketSessionID: string,
  token: string,
  twitchId: string,
): Promise<void> {
  for (let attempt = 1; attempt <= SUBSCRIPTION_MAX_ATTEMPTS; attempt++) {
    const ok = await registerEventSubListeners(
      odaToken,
      websocketSessionID,
      token,
      twitchId,
    );
    if (ok) return;
    console.log(
      `Retrying Twitch subscription creation (attempt ${attempt}/${SUBSCRIPTION_MAX_ATTEMPTS})`,
    );
    await new Promise<void>((resolve) =>
      setTimeout(resolve, SUBSCRIPTION_RETRY_DELAY_MS),
    );
  }
}

interface TwitchConnection {
  odaToken: string;
  twitchId: string;
  token: string;
  eventbus: EventBus;
  emotesStore: EmotesStore;
  socket: WebSocket;
}

function handleWebSocketMessage(connection: TwitchConnection, data: any) {
  switch (data.metadata.message_type) {
    case "session_welcome":
      registerEventSubListenersWithRetry(
        connection.odaToken,
        data.payload.session.id,
        connection.token,
        connection.twitchId,
      );
      break;
    case "session_reconnect":
      // Twitch asks us to move to a new socket. Subscriptions carry over
      // automatically, so the new connection must not re-subscribe.
      const reconnectUrl = data.payload.session.reconnect_url;
      if (reconnectUrl) {
        console.log("Twitch requested session reconnect");
        startWebSocketClient(
          connection.odaToken,
          connection.twitchId,
          connection.token,
          connection.eventbus,
          connection.emotesStore,
          reconnectUrl,
        );
        connection.socket.close(1000, "session_reconnect");
      }
      break;
    case "notification":
      switch (data.metadata.subscription_type) {
        case "channel.chat.message":
          console.log("data.payload.event", data.payload.event);
          const emotes = emotesFromText(
            data.payload.event.message?.text ?? "",
            connection.emotesStore,
          );
          emotes.push(
            ...(data.payload.event.message?.fragments ?? [])
              .filter((fragment: any) => fragment.type === "emote")
              .map((fragment: any) => {
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
              badgeDefinitions
                .get(connection.token)
                ?.get(`${badge.set_id}/${badge.id}`),
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
          connection.eventbus.push(
            new Event("TWITCH_CHAT_MESSAGE", variables),
          );
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
  url: string = EVENTSUB_WEBSOCKET_URL,
): WebSocket {
  console.log({ twitchId }, "Starting Twitch WebSocket connection");
  const websocketClient = new WebSocket(url);
  let reconnecting = false;
  let keepaliveTimer: ReturnType<typeof setTimeout> | undefined;
  let keepaliveTimeoutSeconds = 10;
  websocketClients.add(websocketClient);

  const clearKeepaliveTimer = (): void => {
    if (keepaliveTimer !== undefined) {
      clearTimeout(keepaliveTimer);
      keepaliveTimer = undefined;
    }
  };

  const resetKeepaliveTimer = (): void => {
    clearKeepaliveTimer();
    keepaliveTimer = setTimeout(() => {
      console.log("Twitch WebSocket keepalive timeout, reconnecting");
      reportError(odaToken, "Twitch", "WebSocket keepalive timeout");
      websocketClient.close(1000, "keepalive timeout");
      scheduleReconnect();
    }, keepaliveTimeoutSeconds * 1000);
  };

  // Reconnect on abnormal close/error. Guarded so error + close firing
  // together only schedule one reconnect.
  const scheduleReconnect = (): void => {
    if (reconnecting) return;
    reconnecting = true;
    clearKeepaliveTimer();
    setTimeout(() => {
      startWebSocketClient(odaToken, twitchId, token, eventbus, emotesStore);
    }, RECONNECT_DELAY_MS);
  };

  websocketClient.addEventListener("error", (err) => {
    reportError(odaToken, "Twitch", `WebSocket error: ${err}`);
    scheduleReconnect();
  });

  websocketClient.addEventListener("open", () => {
    console.log("WebSocket connection opened to " + url);
    reportStarted(odaToken, "Twitch");
  });

  websocketClient.addEventListener("close", (event) => {
    const wasRegistered = websocketClients.delete(websocketClient);
    clearKeepaliveTimer();
    if (event.code === 1000) return;
    reportError(
      odaToken,
      "Twitch",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
    if (!wasRegistered) return; // Closed by deregister — do not reconnect.
    console.log(
      `Twitch WebSocket closed. Reconnection attempt in ${RECONNECT_DELAY_MS}ms`,
    );
    scheduleReconnect();
  });

  websocketClient.addEventListener("message", (data) => {
    let message: any;
    try {
      message = JSON.parse(data.data);
    } catch (error) {
      reportError(
        odaToken,
        "Twitch",
        `Failed to parse WebSocket message: ${error}`,
      );
      return;
    }
    if (message.metadata?.message_type === "session_welcome") {
      keepaliveTimeoutSeconds =
        message.payload?.session?.keepalive_timeout_seconds ?? 10;
    }
    resetKeepaliveTimer();
    handleWebSocketMessage(
      {
        odaToken,
        twitchId,
        token,
        eventbus,
        emotesStore,
        socket: websocketClient,
      },
      message,
    );
  });

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
                String(token.settings.id),
                response.data.token,
                eventbus,
                emotesStore,
              ),
            );
        });
    })
    .catch((err) => {
      reportError(odaToken, "Twitch", String(err));
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