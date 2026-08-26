/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getRecipientId } from "./user-authorized";
import { reportError, reportStarted } from "../worker-status";
import {
  AddHistoryItemApiAddHistoryItemCommand,
  addHistoryItem,
} from "@opendonationassistant/history-service";

const DONATEX_HUB_URL = "https://donatex.gg/api/public-donations-hub";

const recipientService = RecipientService(undefined, "https://api.oda.digital");
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
  settings: DonateXTokenSettings,
  donation: DonateXDonation,
): void {
  const recipientId = getRecipientId();
  console.log(
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
      console.log(
        `DonateX donation persisted to history [${donation.amountInRub} RUB]`,
      ),
    )
    .catch((err) =>
      console.error("Failed to persist DonateX donation to history:", err),
    );
}

// ── SignalR connection lifecycle ────────────────────────────────────

function startDonateXConnection(
  odaToken: string,
  dxToken: string,
  settings: DonateXTokenSettings,
): void {
  console.log("Starting DonateX SignalR connection");
  const connection = new HubConnectionBuilder()
    .withUrl(`${DONATEX_HUB_URL}?access_token=${encodeURIComponent(dxToken)}`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  activeConnections.add(connection);

  connection.on("DonationCreated", (donation: DonateXDonation) => {
    handleDonationCreated(odaToken, settings, donation);
  });

  connection
    .start()
    .then(() => {
      console.log("DonateX SignalR connection started");
      reportStarted("DonateX");
    })
    .catch((err) => {
      console.error("Failed to start DonateX SignalR connection:", err);
      reportError(odaToken, "DonateX", `failed to start connection: ${err}`);
    });

  connection.onclose((err) => {
    if (!activeConnections.has(connection)) return; // Stopped by deregister.
    reportError(odaToken, "DonateX", `connection closed: ${err ?? "unknown error"}`);
  });
}

// ── Registration (called from logger-worker) ────────────────────────

export function register(odaToken: string): void {
  console.log({ connected: connectedTokens }, "add donatex-listener");
  const auth = { headers: { Authorization: `Bearer ${odaToken}` } };
  recipientService
    .listTokens(auth)
    .then((tokens) => {
      tokens.data
        .filter((t) => t.system === "DonateX")
        .filter((t) => t.enabled)
        .filter((t) => !connectedTokens.includes(t.id))
        .forEach((t) => {
          console.log(`add donatex handler for ${t.id}`);
          connectedTokens.push(t.id);

          startDonateXConnection(
            odaToken,
            t.token,
            // Generated API types model settings as a generic record; the
            // shape is known for DonateX tokens so cast through unknown.
            t.settings as unknown as DonateXTokenSettings,
          );
        });
    })
    .catch((err) => {
      console.error("Failed to subscribe to DonateX", err);
      reportError(odaToken, "DonateX", err);
    });
}

export function deregister(): void {
  console.log({ connected: connectedTokens }, "remove donatex listener");
  activeConnections.forEach((connection) => {
    activeConnections.delete(connection);
    void connection.stop();
  });
  connectedTokens = [];
}
