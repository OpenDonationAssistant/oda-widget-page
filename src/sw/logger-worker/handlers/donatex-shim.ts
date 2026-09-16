/// <reference lib="webworker" />

import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { reportError, reportStarted } from "../worker-status";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";
import type { TokenDto } from "../systems";
import { log } from "./log";

const DONATEX_HUB_URL = "https://donatex.gg/api/public-donations-hub";

let connectedTokens: string[] = [];
const activeConnections = new Set<HubConnection>();

// ── DonateX SignalR event types ─────────────────────────────────────

interface DonateXDonation {
  id: string;
  username: string;
  message: string;
  amountInRub: number;
  voiceFilePath?: string;
}

interface DonateXTokenSettings {
  triggerAlerts: boolean;
  triggerReel: boolean;
  triggerDonaton: boolean;
  countInTop: boolean;
  addToGoal: boolean;
}

// ── SignalR event handling ──────────────────────────────────────────

function handleDonationCreated(
  odaToken: string,
  recipientId: string,
  settings: DonateXTokenSettings,
  donation: DonateXDonation,
): void {
  log("INFO",
    `DonateX donation: ${donation.amountInRub} RUB from ${donation.username}`,
  );

  const command: AddHistoryItemApiAddHistoryItemCommand = {
    recipientId,
    amount: {
      minor: 0,
      major: donation.amountInRub,
      currency: "RUB",
    },
    nickname: donation.username,
    message: donation.message,
    triggerAlert: settings.triggerAlerts,
    triggerReel: settings.triggerReel,
    triggerDonaton: settings.triggerDonaton,
    goals: [],
    addToTop: settings.countInTop,
    addToGoal: settings.addToGoal,
    paymentId: donation.id,
    system: "DonateX",
    event: "payment",
    alertMedia: {
      url: donation.voiceFilePath,
    },
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
      log("INFO",
        `DonateX donation persisted to history [${donation.amountInRub} RUB]`,
      ),
    )
    .catch((err) => {
      log("ERROR", "Failed to persist DonateX donation to history:", err);
      reportError(odaToken, "DonateX", `failed to persist donation to history: ${err}`);
    });
}

// ── SignalR connection lifecycle ────────────────────────────────────

function startDonateXConnection(
  odaToken: string,
  recipientId: string,
  dxToken: string,
  settings: DonateXTokenSettings,
): void {
  log("INFO", "Starting DonateX SignalR connection");
  const connection = new HubConnectionBuilder()
    .withUrl(`${DONATEX_HUB_URL}?access_token=${encodeURIComponent(dxToken)}`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  activeConnections.add(connection);

  connection.on("DonationCreated", (donation: DonateXDonation) => {
    handleDonationCreated(odaToken, recipientId, settings, donation);
  });

  connection
    .start()
    .then(() => {
      log("INFO", "DonateX SignalR connection started");
      reportStarted(odaToken, "DonateX");
    })
    .catch((err) => {
      log("ERROR", "Failed to start DonateX SignalR connection:", err);
      reportError(odaToken, "DonateX", `failed to start connection: ${err}`);
    });

  connection.onclose((err) => {
    if (!activeConnections.has(connection)) return; // Stopped by deregister.
    reportError(odaToken, "DonateX", `connection closed: ${err ?? "unknown error"}`);
  });
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(
  odaToken: string,
  recipientId: string,
  tokens: TokenDto[] | null,
): void {
  if (!tokens) {
    reportError(odaToken, "DonateX", "Failed to fetch recipient tokens");
    return;
  }
  tokens
    .filter((t) => t.system === "DonateX")
    .filter((t) => t.enabled)
    .filter((t) => !connectedTokens.includes(t.id))
    .forEach((t) => {
      log("INFO", `add donatex handler for ${t.id}`);
      connectedTokens.push(t.id);

      startDonateXConnection(
        odaToken,
        recipientId,
        t.token,
        t.settings as unknown as DonateXTokenSettings,
      );
    });
}

export function deregister(): void {
  activeConnections.forEach((connection) => {
    activeConnections.delete(connection);
    void connection.stop();
  });
  connectedTokens = [];
}
