/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { connect } from "socket.io-client";
import { getRecipientId } from "./user-authorized";
import { reportError, reportStarted } from "../worker-status";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";

const DONATIONALERTS_SOCKET_URL = "wss://socket.donationalerts.com/";

const recipientService = RecipientService(undefined, "https://api.oda.digital");
let connectedTokens: string[] = [];
const activeSockets = new Set<SocketIOClient.Socket>();

// Matches the number of meme packs bought in a MemeAlerts message,
// e.g. "купил 5 мемов" → 5.
const memeAlertsRegexp = /купил (\d+)/;

// ── UnofficialDonationAlerts donation payload ───────────────────────

interface UnofficialDonationAlertsDonation {
  alert_type: number;
  id: string;
  username: string;
  message: string;
  amount_main: number;
  tts_url?: string;
  additional_data?: {
    event_data?: {
      level_name?: string;
    };
  };
}

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Rewrite the DonationAlerts TTS host to the ODA widgets host so the
 * alert media is served through the widget infrastructure.
 */
function buildAlertMedia(ttsUrl?: string): { url: string } | null {
  if (!ttsUrl) return null;
  return {
    url: ttsUrl.replace("files.donationalerts.com", "widgets.oda.digital"),
  };
}

/**
 * Extract the number of meme packs bought from the donation message.
 */
function extractMemeAlertsCount(message?: string): number | null {
  const match = memeAlertsRegexp.exec(message ?? "");
  if (!match?.[1]) return null;
  return Number(match[1]);
}

/**
 * Persist a donation to the history service.  All UnofficialDonationAlerts
 * events share the same alert flags and RUB currency; per-case fields are
 * merged in from the caller.
 */
function persistDonation(
  odaToken: string,
  donation: UnofficialDonationAlertsDonation,
  command: AddHistoryItemApiAddHistoryItemCommand,
): void {
  addHistoryItem({
    baseURL: "https://api.oda.digital",
    body: {
      recipientId: getRecipientId(),
      nickname: donation.username,
      message: donation.message,
      triggerAlert: true,
      triggerReel: false,
      triggerDonaton: false,
      addToTop: false,
      addToGoal: false,
      goals: [],
      authorizationTimestamp: new Date().toISOString(),
      ...command,
    },
    headers: {
      Authorization: `Bearer ${odaToken}`,
    },
  })
    .then(() =>
      console.log(
        `UnofficialDonationAlerts donation persisted to history [${donation.username}]`,
      ),
    )
    .catch((err) =>
      console.error(
        "Failed to persist UnofficialDonationAlerts donation to history:",
        err,
      ),
    );
}

// ── Donation handling ───────────────────────────────────────────────

function handleDonation(odaToken: string, raw: string): void {
  let donation: UnofficialDonationAlertsDonation;
  try {
    donation = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse UnofficialDonationAlerts donation:", err);
    return;
  }

  switch (donation.alert_type) {
    case 27:
      // Boosty follow
      persistDonation(odaToken, donation, {
        amount: { minor: 0, major: 0, currency: "RUB" },
        event: "follow",
        paymentId: donation.id,
        system: "Boosty",
      });
      break;
    case 20:
    case 28:
      // Boosty subscription
      persistDonation(odaToken, donation, {
        amount: { minor: 0, major: donation.amount_main, currency: "RUB" },
        event: "subscription",
        levelName: donation.additional_data?.event_data?.level_name,
        paymentId: donation.id,
        system: "Boosty",
      });
      break;
    case 32:
      // MemeAlerts payment
      persistDonation(odaToken, donation, {
        amount: { minor: 0, major: donation.amount_main, currency: "RUB" },
        event: "payment",
        count: extractMemeAlertsCount(donation.message),
        externalId: donation.id,
        paymentId: donation.id,
        system: "MemeAlerts",
        alertMedia: buildAlertMedia(donation.tts_url),
      });
      break;
    case 1:
      // DonationAlerts payment
      persistDonation(odaToken, donation, {
        amount: { minor: 0, major: donation.amount_main, currency: "RUB" },
        event: "payment",
        paymentId: donation.id,
        system: "DonationAlerts",
        alertMedia: buildAlertMedia(donation.tts_url),
      });
      break;
    default:
      break;
  }
}

// ── Socket.io lifecycle ─────────────────────────────────────────────

function startSocketClient(odaToken: string, daToken: string): void {
  console.log("Starting UnofficialDonationAlerts socket.io connection");
  const socket = connect(DONATIONALERTS_SOCKET_URL, {
    reconnection: true,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000,
  });
  activeSockets.add(socket);

  socket.on("connect", () => {
    console.log("UnofficialDonationAlerts socket connected");
    reportStarted("UnofficialDonationAlerts");
    socket.emit("add-user", {
      token: daToken,
      type: "alert_widget",
    });
  });

  socket.on("connect_error", (msg: string) => {
    console.error("UnofficialDonationAlerts connection_error:", msg);
    reportError("UnofficialDonationAlerts", `connect_error: ${msg}`);
  });

  socket.on("disconnect", (reason: string) => {
    if (reason === "io client disconnect") return;
    reportError("UnofficialDonationAlerts", `disconnected: ${reason}`);
  });

  socket.on("reconnect", () => {
    console.log("UnofficialDonationAlerts socket reconnected");
  });

  socket.on("donation", (msg: string) => {
    handleDonation(odaToken, msg);
  });
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(token: string): void {
  console.log(
    { connected: connectedTokens },
    "add unofficial-donationalerts-listener",
  );
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((t) => t.system === "UnofficialDonationAlerts")
        .filter((t) => t.enabled)
        .filter((t) => !connectedTokens.includes(t.id))
        .forEach((t) => {
          console.log(`add unofficial-donationalerts handler for ${t.id}`);
          connectedTokens.push(t.id);

          startSocketClient(token, t.token);
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to UnofficialDonationAlerts", err);
      reportError("UnofficialDonationAlerts", err);
    });
}

export function deregister(): void {
  console.log(
    { connected: connectedTokens },
    "remove unofficial-donationalerts listener",
  );
  activeSockets.forEach((socket) => {
    activeSockets.delete(socket);
    socket.disconnect();
  });
  connectedTokens = [];
}
