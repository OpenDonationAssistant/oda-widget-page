/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";
import { getRecipientId } from "./user-authorized";
import axios from "axios";

const DONATEPAY_SOCKET_TOKEN_URL = "https://donatepay.ru/api/v2/socket/token";
const CENTRIFUGO_WEBSOCKET_URL =
  "wss://centrifugo.donatepay.ru:443/connection/websocket";
const RECONNECT_DELAY_MS = 1000;

const recipientService = RecipientService(undefined, "https://api.oda.digital");
const connectedTokens: string[] = [];

// ── DonatePay data shapes ──────────────────────────────────────────

interface DonatePaySettings {
  id: string;
  triggerAlerts: boolean;
  triggerReel: boolean;
  triggerDonaton: boolean;
  countInTop: boolean;
  addToGoal: boolean;
}

interface DonatePayPayment {
  id?: string;
  vars: {
    sum: number;
    currency: string;
    name: string;
    comment: string;
  };
}

/**
 * Centrifugo push message: either the auth reply (id: 1) or a
 * donation event published on the subscribed channel.
 */
interface DonatePayMessage {
  id?: number;
  result?: {
    client?: string;
    channel?: string;
    data?: {
      data?: {
        notification?: DonatePayPayment;
      };
    };
  };
}

// ── DonatePay API helpers ──────────────────────────────────────────

/**
 * Exchange the DonatePay access token for a Centrifugo connection token.
 */
async function getCentrifugoToken(dpToken: string): Promise<string> {
  const response = await axios.post(DONATEPAY_SOCKET_TOKEN_URL, {
    access_token: dpToken,
  });
  return response.data.token;
}

/**
 * Ask the DonatePay backend for a channel subscription token bound to
 * the client id returned by the Centrifugo auth reply.
 */
async function subscribeToChannel(
  dpToken: string,
  channel: string,
  client: string,
): Promise<string> {
  const response = await axios.post(DONATEPAY_SOCKET_TOKEN_URL, {
    access_token: dpToken,
    channels: [channel],
    client,
  });
  return response.data.channels[0].token;
}

// ── WebSocket message handling ─────────────────────────────────────

function handleWebSocketMessage(
  odaToken: string,
  dpToken: string,
  settings: DonatePaySettings,
  channel: string,
  raw: string,
  socket: WebSocket,
): void {
  const message: DonatePayMessage = JSON.parse(raw);

  if (message.id === 1) {
    const client = message.result?.client;
    if (!client) {
      console.error("DonatePay Centrifugo auth reply missing client id");
      return;
    }
    subscribeToChannel(dpToken, channel, client)
      .then((channelToken) => {
        console.log(`DonatePay subscribed to channel ${channel}`);
        socket.send(
          JSON.stringify({
            params: {
              channel,
              token: channelToken,
            },
            method: 1,
            id: 2,
          }),
        );
      })
      .catch((err) =>
        console.error("Failed to subscribe to DonatePay channel:", err),
      );
    return;
  }

  if (
    message.result?.channel === channel &&
    message.result?.data?.data?.notification
  ) {
    handleDonation(odaToken, settings, message.result.data.data.notification);
  }
}

function handleDonation(
  odaToken: string,
  settings: DonatePaySettings,
  payment: DonatePayPayment,
): void {
  const recipientId = getRecipientId();
  console.log(
    `DonatePay donation: ${payment.vars.sum} ${payment.vars.currency} from ${payment.vars.name}`,
  );

  const command: AddHistoryItemApiAddHistoryItemCommand = {
    recipientId,
    amount: {
      minor: 0,
      major: payment.vars.sum,
      currency: payment.vars.currency,
    },
    nickname: payment.vars.name,
    message: payment.vars.comment,
    triggerAlert: settings.triggerAlerts,
    triggerReel: settings.triggerReel,
    triggerDonaton: settings.triggerDonaton,
    goals: [],
    addToTop: settings.countInTop,
    addToGoal: settings.addToGoal,
    paymentId:
      payment.id ??
      hashString(`${payment.vars.name}:${payment.vars.comment}`).toString(),
    system: "DonatePay",
    event: "payment",
    authorizationTimestamp: new Date().toISOString(),
  };

  addHistoryItem({
    body: command,
    headers: {
      Authorization: `Bearer ${odaToken}`,
    },
  })
    .then(() =>
      console.log(
        `DonatePay donation persisted to history [${payment.vars.sum} ${payment.vars.currency}]`,
      ),
    )
    .catch((err) =>
      console.error("Failed to persist DonatePay donation to history:", err),
    );
}

// ── WebSocket lifecycle ─────────────────────────────────────────────

function startWebSocketClient(
  odaToken: string,
  dpToken: string,
  settings: DonatePaySettings,
  centrifugoToken: string,
): void {
  console.log("Starting DonatePay Centrifugo WebSocket connection");
  const socket = new WebSocket(CENTRIFUGO_WEBSOCKET_URL);
  const channel = `$public:${settings.id}`;
  let reconnecting = false;

  // Reconnect on close/error (replaces navigate(0) — not possible in a SW).
  // Guarded so error + close firing together only schedules one reconnect.
  const scheduleReconnect = (): void => {
    if (reconnecting) return;
    reconnecting = true;
    setTimeout(() => {
      startConnection(odaToken, dpToken, settings);
    }, RECONNECT_DELAY_MS);
  };

  socket.addEventListener("error", (err) => {
    console.error("DonatePay WebSocket error:", err);
    scheduleReconnect();
  });

  socket.addEventListener("open", () => {
    console.log("DonatePay Centrifugo WebSocket opened");
    socket.send(
      JSON.stringify({
        params: {
          token: centrifugoToken,
        },
        id: 1,
      }),
    );
  });

  socket.addEventListener("message", (event) => {
    handleWebSocketMessage(
      odaToken,
      dpToken,
      settings,
      channel,
      event.data as string,
      socket,
    );
  });

  socket.addEventListener("close", () => {
    console.log(
      "DonatePay Centrifugo WebSocket closed. Reconnection attempt in 1s",
    );
    scheduleReconnect();
  });
}

function startConnection(
  odaToken: string,
  dpToken: string,
  settings: DonatePaySettings,
): void {
  getCentrifugoToken(dpToken)
    .then((centrifugoToken) => {
      startWebSocketClient(odaToken, dpToken, settings, centrifugoToken);
    })
    .catch((err) => console.error("Failed to get DonatePay socket token:", err));
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(token: string): void {
  console.log({ connected: connectedTokens }, "add donatepay-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((t) => t.system === "DonatePay")
      .filter((t) => t.enabled)
      .filter((t) => !connectedTokens.includes(t.id))
      .forEach((t) => {
        console.log(`add donatepay handler for ${t.id}`);
        connectedTokens.push(t.id);

        startConnection(
          token,
          t.token,
          t.settings as unknown as DonatePaySettings,
        );
      });
  });
}

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Signed 32-bit string hash (hash * 31 + char, forced to 32-bit).
 * Inlined here to avoid pulling src/utils.ts (and its React/axios
 * imports) into the service worker bundle.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // hash * 31 + char
    hash |= 0; // force 32-bit int
  }
  return hash; // signed 32-bit
}