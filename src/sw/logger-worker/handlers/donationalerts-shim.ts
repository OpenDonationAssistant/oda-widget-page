/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";
import { getRecipientId } from "./user-authorized";
import axios from "axios";

const DONATIONALERTS_API_URL = "https://api.oda.digital/donationalerts";
const CENTRIFUGO_WEBSOCKET_URL =
  "wss://centrifugo.donationalerts.com/connection/websocket";
const CENTRIFUGO_SUBSCRIBE_URL =
  "https://www.donationalerts.com/api/v1/centrifuge/subscribe";

const recipientService = RecipientService(undefined, "https://api.oda.digital");
const connectedTokens: string[] = [];

// ── DonationAlerts data shapes ─────────────────────────────────────

interface DonationAlertsSettings {
  triggerAlerts: boolean;
  triggerReel: boolean;
  triggerDonaton: boolean;
  countInTop: boolean;
  addToGoal: boolean;
}

interface DonationAlertsPayment {
  id: string;
  username: string;
  message: string;
  amount_in_user_currency: number;
}

/**
 * Centrifugo push message: either the auth reply (id: 1) or a
 * donation event published on the subscribed channel.
 */
interface DonationAlertsMessage {
  id?: number;
  result?: {
    client?: string;
    channel?: string;
    data?: {
      data?: DonationAlertsPayment;
    };
  };
}

// ── DonationAlerts API helpers ─────────────────────────────────────

/**
 * Exchange the DonationAlerts access token for the user ID and the
 * Centrifugo connection token.
 */
async function getSocketConnectionInfo(
  daToken: string,
): Promise<{ userId: string; centrifugoToken: string }> {
  const response = await axios.get(DONATIONALERTS_API_URL, {
    headers: { Authorization: `Bearer ${daToken}` },
  });
  return {
    userId: response.data.data.id,
    centrifugoToken: response.data.data.socket_connection_token,
  };
}

/**
 * Ask the DonationAlerts backend for a channel subscription token
 * bound to the client id returned by the Centrifugo auth reply.
 */
async function subscribeToChannel(
  daToken: string,
  channel: string,
  client: string,
): Promise<string> {
  const response = await axios.post(
    CENTRIFUGO_SUBSCRIBE_URL,
    { channels: [channel], client },
    { headers: { Authorization: `Bearer ${daToken}` } },
  );
  return response.data.channels[0].token;
}

// ── WebSocket message handling ─────────────────────────────────────

function handleWebSocketMessage(
  odaToken: string,
  daToken: string,
  settings: DonationAlertsSettings,
  channel: string,
  raw: string,
  socket: WebSocket,
): void {
  const message: DonationAlertsMessage = JSON.parse(raw);

  if (message.id === 1) {
    const client = message.result?.client;
    if (!client) {
      console.error("DonationAlerts Centrifugo auth reply missing client id");
      return;
    }
    subscribeToChannel(daToken, channel, client)
      .then((channelToken) => {
        console.log(
          `DonationAlerts subscribed to channel ${channel}`,
        );
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
        console.error("Failed to subscribe to DonationAlerts channel:", err),
      );
    return;
  }

  if (message.result?.channel === channel && message.result?.data?.data) {
    handleDonation(odaToken, settings, message.result.data.data);
  }
}

function handleDonation(
  odaToken: string,
  settings: DonationAlertsSettings,
  payment: DonationAlertsPayment,
): void {
  const recipientId = getRecipientId();
  console.log(
    `DonationAlerts donation: ${payment.amount_in_user_currency} RUB from ${payment.username}`,
  );

  const command: AddHistoryItemApiAddHistoryItemCommand = {
    recipientId,
    amount: {
      minor: 0,
      major: payment.amount_in_user_currency,
      currency: "RUB",
    },
    nickname: payment.username,
    message: payment.message,
    triggerAlert: settings.triggerAlerts,
    triggerReel: settings.triggerReel,
    triggerDonaton: settings.triggerDonaton,
    goals: [],
    addToTop: settings.countInTop,
    addToGoal: settings.addToGoal,
    paymentId: payment.id,
    system: "DonationAlerts",
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
        `DonationAlerts donation persisted to history [${payment.amount_in_user_currency} RUB]`,
      ),
    )
    .catch((err) =>
      console.error(
        "Failed to persist DonationAlerts donation to history:",
        err,
      ),
    );
}

// ── WebSocket lifecycle ─────────────────────────────────────────────

function startWebSocketClient(
  odaToken: string,
  daToken: string,
  settings: DonationAlertsSettings,
  userId: string,
  centrifugoToken: string,
): void {
  console.log("Starting DonationAlerts Centrifugo WebSocket connection");
  const socket = new WebSocket(CENTRIFUGO_WEBSOCKET_URL);
  const channel = `$alerts:donation_${userId}`;

  socket.addEventListener("error", (err) => {
    console.error("DonationAlerts WebSocket error:", err);
  });

  socket.addEventListener("open", () => {
    console.log("DonationAlerts Centrifugo WebSocket opened");
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
      daToken,
      settings,
      channel,
      event.data as string,
      socket,
    );
  });

  socket.addEventListener("close", () => {
    console.log(
      "DonationAlerts Centrifugo WebSocket closed. Reconnection attempt in 1s",
    );
    setTimeout(() => {
      startConnection(odaToken, daToken, settings);
    }, 1000);
  });
}

function startConnection(
  odaToken: string,
  daToken: string,
  settings: DonationAlertsSettings,
): void {
  getSocketConnectionInfo(daToken)
    .then(({ userId, centrifugoToken }) => {
      startWebSocketClient(odaToken, daToken, settings, userId, centrifugoToken);
    })
    .catch((err) =>
      console.error(
        "Failed to get DonationAlerts socket connection info:",
        err,
      ),
    );
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(token: string): void {
  console.log({ connected: connectedTokens }, "add donationalerts-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((t) => t.system === "DonationAlerts")
      .filter((t) => t.enabled)
      .filter((t) => !connectedTokens.includes(t.id))
      .forEach((t) => {
        console.log(`add donationalerts handler for ${t.id}`);
        connectedTokens.push(t.id);

        startConnection(
          token,
          t.token,
          t.settings as unknown as DonationAlertsSettings,
        );
      });
  });
}
