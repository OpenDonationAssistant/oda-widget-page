/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";
import { getRecipientId } from "./user-authorized";
import { reportError, reportStarted } from "../worker-status";
import axios from "axios";

const DONATEPAY_EU_WEBSOCKET_URL =
  "wss://centrifugo.donatepay.eu:443/connection/websocket";
const DONATEPAY_EU_API_URL = "https://donatepay.eu";
const RECONNECT_DELAY_MS = 5000;

const recipientService = RecipientService(undefined, "https://api.oda.digital");
let connectedTokens: string[] = [];
const activeSockets = new Set<WebSocket>();

// ── DonatePay.eu data shapes ────────────────────────────────────────

interface DonatePayEuSettings {
  triggerAlerts: boolean;
  triggerReel: boolean;
  triggerDonaton: boolean;
  countInTop: boolean;
  addToGoal: boolean;
}

interface DonatePayEuNotification {
  id?: string;
  vars: {
    sum: number;
    currency: string;
    name: string;
    comment: string;
  };
}

interface DonatePayEuSocketMessage {
  id?: number;
  result?: {
    client?: string;
    channel?: string;
    data?: {
      data?: {
        notification?: DonatePayEuNotification;
      };
    };
  };
}

/**
 * Signed 32-bit string hash (hash * 31 + char). Inlined — importing
 * src/utils.ts would pull the React app into the SW bundle.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // hash * 31 + char
    hash |= 0; // force 32-bit int
  }
  return hash;
}

// ── DonatePay.eu API handshake ──────────────────────────────────────

/** Fetch the user id used to build the Centrifugo channel name. */
async function getUserId(accessToken: string): Promise<string> {
  const response = await axios.get(
    `${DONATEPAY_EU_API_URL}/api/v1/user?access_token=${accessToken}`,
  );
  return response.data.data.id as string;
}

/** Obtain a Centrifugo connection token for the WebSocket handshake. */
async function getConnectionToken(accessToken: string): Promise<string> {
  const response = await axios.post(
    `${DONATEPAY_EU_API_URL}/api/v2/socket/token`,
    { access_token: accessToken },
  );
  return response.data.token as string;
}

/** Exchange the Centrifugo client id for a channel subscription token. */
async function getChannelToken(
  accessToken: string,
  channel: string,
  clientId: string,
): Promise<string> {
  const response = await axios.post(
    `${DONATEPAY_EU_API_URL}/api/v2/socket/token`,
    {
      access_token: accessToken,
      channels: [channel],
      client: clientId,
    },
  );
  return response.data.channels[0].token as string;
}

// ── Payment handling ────────────────────────────────────────────────

function handlePayment(
  odaToken: string,
  payment: DonatePayEuNotification,
  settings: DonatePayEuSettings,
): void {
  const recipientId = getRecipientId();
  console.log(
    `DonatePay.eu payment: ${payment.vars.sum} ${payment.vars.currency} from ${payment.vars.name}`,
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
    system: "DonatePay.eu",
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
        `DonatePay.eu payment persisted to history [${payment.vars.sum} ${payment.vars.currency}]`,
      ),
    )
    .catch((err) =>
      console.error("Failed to persist DonatePay.eu payment to history:", err),
    );
}

// ── WebSocket message handling ──────────────────────────────────────

function handleWebSocketMessage(
  odaToken: string,
  donatePayEuToken: string,
  settings: DonatePayEuSettings,
  channel: string,
  raw: string,
  websocketClient: WebSocket,
): void {
  const message: DonatePayEuSocketMessage = JSON.parse(raw);

  // Connection acknowledged — exchange the client id for a channel token
  if (message.id === 1) {
    console.log("DonatePay.eu getting Centrifugo channel token");
    const clientId = message.result?.client;
    if (!clientId) return;
    getChannelToken(donatePayEuToken, channel, clientId)
      .then((channelToken) => {
        websocketClient.send(
          JSON.stringify({
            params: { channel, token: channelToken },
            method: 1,
            id: 2,
          }),
        );
      })
      .catch((err) =>
        console.error("Failed to get DonatePay.eu channel token:", err),
      );
  }

  if (
    message.result?.channel === channel &&
    message.result?.data?.data?.notification
  ) {
    handlePayment(odaToken, message.result.data.data.notification, settings);
  }
}

// ── WebSocket lifecycle ─────────────────────────────────────────────

function startDonatePayEuClient(
  odaToken: string,
  donatePayEuToken: string,
  settings: DonatePayEuSettings,
): void {
  console.log("Starting DonatePay.eu WebSocket connection");

  getUserId(donatePayEuToken)
    .then((id) =>
      getConnectionToken(donatePayEuToken).then((centrifugoToken) => ({
        id,
        centrifugoToken,
      })),
    )
    .then(({ id, centrifugoToken }) => {
      const channel = `$public:${id}`;
      const websocketClient = new WebSocket(DONATEPAY_EU_WEBSOCKET_URL);
      activeSockets.add(websocketClient);

      // SW cannot navigate(0) — restart the client after a delay instead
      let reconnectScheduled = false;
      const scheduleReconnect = () => {
        if (reconnectScheduled) return;
        reconnectScheduled = true;
        console.log(
          `DonatePay.eu WebSocket disconnected — reconnecting in ${RECONNECT_DELAY_MS}ms`,
        );
        setTimeout(() => {
          reconnectScheduled = false;
          startDonatePayEuClient(odaToken, donatePayEuToken, settings);
        }, RECONNECT_DELAY_MS);
      };

      websocketClient.addEventListener("open", () => {
        console.log("DonatePay.eu WebSocket opened");
        reportStarted("DonatePay.eu");
        websocketClient.send(
          JSON.stringify({
            params: { token: centrifugoToken },
            id: 1,
          }),
        );
      });

      websocketClient.addEventListener("message", (event) => {
        handleWebSocketMessage(
          odaToken,
          donatePayEuToken,
          settings,
          channel,
          event.data as string,
          websocketClient,
        );
      });

      websocketClient.addEventListener("error", (err) => {
        console.error("DonatePay.eu WebSocket error:", err);
        scheduleReconnect();
      });

      websocketClient.addEventListener("close", (event) => {
        const wasRegistered = activeSockets.delete(websocketClient);
        console.log("DonatePay.eu WebSocket closed");
        if (event.code !== 1000) {
          reportError(
            "DonatePay.eu",
            `WebSocket closed with code ${event.code}${event.reason ? `: ${event.reason}` : ""}`,
          );
        }
        if (!wasRegistered) return; // Closed by deregister — do not reconnect.
        scheduleReconnect();
      });
    })
    .catch((err) =>
      console.error("Failed to start DonatePay.eu WebSocket connection:", err),
    );
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(token: string): void {
  console.log({ connected: connectedTokens }, "add donatepay-eu-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((t) => t.system === "DonatePay.eu")
        .filter((t) => t.enabled)
        .filter((t) => !connectedTokens.includes(t.id))
        .forEach((t) => {
          console.log(`add donatepay-eu handler for ${t.id}`);
          connectedTokens.push(t.id);

          startDonatePayEuClient(
            token,
            t.token,
            t.settings as unknown as DonatePayEuSettings,
          );
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to DonatePay.eu", err);
      reportError("DonatePay.eu", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove donatepay-eu listener");
  activeSockets.forEach((websocketClient) => {
    activeSockets.delete(websocketClient);
    websocketClient.close(1000, "deregistered");
  });
  connectedTokens = [];
}
