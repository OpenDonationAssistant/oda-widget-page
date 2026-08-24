/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";
import { getRecipientId } from "./user-authorized";
import { reportError, reportStarted } from "../worker-status";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";

const ASTRO_WEBSOCKET_URL = "wss://astro.streamelements.com";

const recipientService = RecipientService(undefined, "https://api.oda.digital");
const connectedTokens: string[] = [];

// ── StreamElements WebSocket message types ──────────────────────────

interface StreamElementsWelcome {
  type: "welcome";
  data: {
    client_id: string;
  };
}

interface StreamElementsResponse {
  type: "response";
  nonce?: string;
  error?: string;
  data: {
    message: string;
  };
}

interface StreamElementsTipEvent {
  type: "message";
  topic: "channel.tips";
  room: string;
  data: {
    _id: string;
    channel: string;
    provider: string;
    approved: string;
    status: string;
    transactionId: string;
    donation: {
      user: {
        username: string;
        geo?: string;
        email?: string;
        channel?: string;
      };
      message: string;
      amount: number;
      currency: string;
      paymentMethod: string;
    };
  };
}

type StreamElementsMessage =
  | StreamElementsWelcome
  | StreamElementsResponse
  | StreamElementsTipEvent
  | { type: "reconnect"; data: { reconnect_token: string } };

/**
 * Exchange the StreamElements JWT for channel info to obtain the channel ID.
 */
async function getChannelId(jwtToken: string): Promise<string> {
  const response = await fetch(
    "https://api.streamelements.com/kappa/v2/channels/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to get StreamElements channel: ${response.status}`);
  }
  const json = await response.json();
  return json._id as string;
}

/**
 * Convert the StreamElements tip amount into the ODA Amount format.
 * For USD, minor = cents (e.g. $4.20 → major=4, minor=20).
 */
function toOdaAmount(
  amount: number,
  currency: string,
): { major: number; minor: number; currency: string } {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  return { major, minor, currency };
}

// ── WebSocket message handling ──────────────────────────────────────

function handleWebSocketMessage(
  odaToken: string,
  seToken: string,
  raw: string,
  eventbus: EventBus,
): void {
  const message: StreamElementsMessage = JSON.parse(raw);

  switch (message.type) {
    case "welcome": {
      console.log(
        `StreamElements Astro connected [client_id: ${message.data.client_id}]`,
      );

      // Fetch channel ID and subscribe to tips
      getChannelId(seToken)
        .then((channelId) => {
          console.log(`Subscribing to channel.tips for room ${channelId}`);
          const ws = getActiveWebSocket(seToken);
          if (!ws) return;
          ws.send(
            JSON.stringify({
              type: "subscribe",
              nonce: uuidv7(),
              data: {
                topic: "channel.tips",
                room: channelId,
                token: seToken,
                token_type: "jwt",
              },
            }),
          );
        })
        .catch((err) =>
          console.error("Failed to get StreamElements channel:", err),
        );
      break;
    }

    case "response": {
      if (message.error) {
        console.error(
          `StreamElements subscribe error: ${message.error} - ${message.data.message}`,
        );
      } else {
        console.log(
          `StreamElements subscription success: ${message.data.message}`,
        );
      }
      break;
    }

    case "message": {
      if (message.topic === "channel.tips") {
        handleTipEvent(odaToken, message, eventbus);
      }
      break;
    }

    case "reconnect": {
      console.log("StreamElements requesting reconnect");
      break;
    }
  }
}

function handleTipEvent(
  odaToken: string,
  event: StreamElementsTipEvent,
  eventbus: EventBus,
): void {
  const tip = event.data.donation;
  const recipientId = getRecipientId();
  console.log(
    `StreamElements tip: ${tip.amount} ${tip.currency} from ${tip.user.username}`,
  );

  // ── 1. Persist to HistoryService as a payment event ──────────────
  const command: AddHistoryItemApiAddHistoryItemCommand = {
    nickname: tip.user.username,
    recipientId,
    amount: toOdaAmount(tip.amount, tip.currency),
    message: tip.message ?? "",
    system: "StreamElements",
    externalId: event.data._id,
    event: "payment",
    authorizationTimestamp: new Date().toISOString(),
  };

  addHistoryItem({
    baseURL: "https://api.oda.digital",
    body: command,
    headers: {
      Authorization: `Bearer ${odaToken}`,
    },
  })
    .then(() =>
      console.log(
        `StreamElements tip persisted to history [${tip.amount} ${tip.currency}]`,
      ),
    )
    .catch((err) =>
      console.error("Failed to persist StreamElements tip to history:", err),
    );

  // ── 2. Push a local event to the EventBus for real-time UI ───────
  const variables: Variable[] = [
    { id: uuidv7(), name: "amount", value: tip.amount, type: "number" },
    { id: uuidv7(), name: "currency", value: tip.currency, type: "string" },
    {
      id: uuidv7(),
      name: "nickname",
      value: tip.user.username,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message",
      value: tip.message ?? "",
      type: "string",
    },
    {
      id: uuidv7(),
      name: "system",
      value: "StreamElements",
      type: "string",
    },
    { id: uuidv7(), name: "externalId", value: event.data._id, type: "string" },
  ];
  eventbus.push(new Event("payment", variables));
}

// ── WebSocket lifecycle ─────────────────────────────────────────────

const activeSockets = new Map<string, WebSocket>();

function getActiveWebSocket(jwtToken: string): WebSocket | undefined {
  return activeSockets.get(jwtToken);
}

function startWebSocketClient(
  odaToken: string,
  seToken: string,
  eventbus: EventBus,
): WebSocket {
  console.log("Starting StreamElements Astro WebSocket connection");
  const websocketClient = new WebSocket(ASTRO_WEBSOCKET_URL);

  websocketClient.addEventListener("error", (err) => {
    console.error("StreamElements WebSocket error:", err);
  });

  websocketClient.addEventListener("open", () => {
    console.log("StreamElements Astro WebSocket opened");
    reportStarted("StreamElements");
  });

  websocketClient.addEventListener("message", (event) => {
    handleWebSocketMessage(odaToken, seToken, event.data as string, eventbus);
  });

  websocketClient.addEventListener("close", (event) => {
    console.log("StreamElements Astro WebSocket closed");
    activeSockets.delete(seToken);
    if (event.code === 1000) return;
    reportError(
      "StreamElements",
      `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
    );
  });

  activeSockets.set(seToken, websocketClient);
  return websocketClient;
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(token: string, eventbus: EventBus): void {
  console.log({ connected: connectedTokens }, "add streamelements-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((t) => t.system === "StreamElements")
        .filter((t) => !connectedTokens.includes(t.id))
        .forEach((t) => {
          console.log(`add streamelements handler for ${t.id}`);
          connectedTokens.push(t.id);

          startWebSocketClient(token, t.token, eventbus);
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to StreamElements", err);
      reportError("StreamElements", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove streamelements listener");
  activeSockets.forEach((websocketClient) => {
    websocketClient.close(1000, "deregistered");
  });
  activeSockets.clear();
  connectedTokens.length = 0;
}
