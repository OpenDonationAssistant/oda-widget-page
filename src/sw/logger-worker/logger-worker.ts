/// <reference lib="webworker" />

import {
  register as registerDonationAlertsHandler,
  deregister as deregisterDonationAlertsHandler,
} from "./handlers/donationalerts-shim";
import {
  register as registerDonatePayEuHandler,
  deregister as deregisterDonatePayEuHandler,
} from "./handlers/donatepay-eu-shim";
import {
  register as registerDonatePayHandler,
  deregister as deregisterDonatePayHandler,
} from "./handlers/donatepay-shim";
import {
  register as registerDonateXHandler,
  deregister as deregisterDonateXHandler,
} from "./handlers/donatex-shim";
import {
  register as registerKickChatHandler,
  deregister as deregisterKickChatHandler,
} from "./handlers/kick-chat";
import { register as registerLogHandler } from "./handlers/log";
import {
  register as registerStreamElementsHandler,
  deregister as deregisterStreamElementsHandler,
} from "./handlers/streamelements-shim";
import {
  register as registerTwitchChatHandler,
  deregister as deregisterTwitchChatHandler,
} from "./handlers/twitch-chat";
import {
  register as registerUnofficialDonationAlertsHandler,
  deregister as deregisterUnofficialDonationAlertsHandler,
} from "./handlers/unofficial-donationalerts-shim";
import {
  register as registerVKLiveChatHandler,
  deregister as deregisterVKLiveChatHandler,
} from "./handlers/vklive-chat";
import { register as registerWidgetsHandler } from "./handlers/widgets";
import { register as registerWorkerStatusHandler } from "./worker-status";
import {
  isFeatureEnabled,
  SW_DONATIONS_FEATURE,
  type Feature,
} from "../../shared/features";
import { DefaultEventBus } from "../../bus/EventBus";
import { DefaultEmotesStore } from "../../stores/EmotesStore";
import type {
  MessageListener,
  MessageListenerRegistrar,
  WorkerMessageEvent,
} from "./messaging";

/** Shared worker scope — cast from the generic `self`. */
const swScope = self as unknown as SharedWorkerGlobalScope;

// ── Port management ─────────────────────────────────────────────────
//
// Every client that constructs `new SharedWorker(...)` with the same URL
// and name connects to this scope. We keep the ports in a Set so events
// can be broadcast to all connected clients (the SharedWorker equivalent
// of `clients.matchAll()`).

const ports = new Set<MessagePort>();
const messageListeners = new Set<MessageListener>();

function broadcast(msg: unknown) {
  for (const port of ports) {
    try {
      port.postMessage(msg);
    } catch {
      // Port is dead (tab closed) — drop it.
      ports.delete(port);
    }
  }
}

function addMessageListener(listener: MessageListener) {
  messageListeners.add(listener);
}

function dispatchMessage(data: unknown, port: MessagePort) {
  const event: WorkerMessageEvent = { data, port };
  for (const listener of messageListeners) {
    listener(event);
  }
}

swScope.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  ports.add(port);
  port.onmessage = (msgEvent: MessageEvent) =>
    dispatchMessage(msgEvent.data, port);
  port.start();
};

// ── State ───────────────────────────────────────────────────────────

let connected = false;
let recipientId = "unknown";
let donationsEnabled = false;
const tokens = new Map<String, String>();
let eventbus: DefaultEventBus | null = null;
let emotesStore: DefaultEmotesStore | null = null;

/**
 * Register handlers that can be deregistered and re-registered with a
 * (possibly new) token. Event bus and emotes store are reused, so the
 * handlers keep feeding events into the same bus after a reload.
 */
function registerHandlers(token: string, recipientId: string) {
  registerCoreHandlers(token, recipientId);
  if (donationsEnabled) {
    registerDonationHandlers(token, recipientId);
  }
}

/** Chat and widget handlers — always registered. */
function registerCoreHandlers(token: string, recipientId: string) {
  registerTwitchChatHandler(token, recipientId, eventbus!, emotesStore!);
  registerVKLiveChatHandler(token, recipientId, eventbus!, emotesStore!);
  registerKickChatHandler(token, recipientId, eventbus!, emotesStore!);
  registerWidgetsHandler(token, recipientId, addMessageListener);
}

/** Donation handlers — only registered when SW_DONATIONS is enabled. */
function registerDonationHandlers(token: string, recipientId: string) {
  registerStreamElementsHandler(token, recipientId, eventbus!);
  registerDonationAlertsHandler(token, recipientId);
  registerDonatePayHandler(token, recipientId);
  registerDonatePayEuHandler(token, recipientId);
  registerUnofficialDonationAlertsHandler(token, recipientId);
  registerDonateXHandler(token, recipientId);
}

/** Deregister all handlers that support it. */
function deregisterHandlers() {
  deregisterCoreHandlers();
  if (donationsEnabled) {
    deregisterDonationHandlers();
  }
}

function deregisterCoreHandlers() {
  deregisterKickChatHandler();
  deregisterTwitchChatHandler();
  deregisterVKLiveChatHandler();
}

function deregisterDonationHandlers() {
  deregisterDonationAlertsHandler();
  deregisterDonatePayEuHandler();
  deregisterDonatePayHandler();
  deregisterDonateXHandler();
  deregisterStreamElementsHandler();
  deregisterUnofficialDonationAlertsHandler();
}

// ── Per-handler reload ──────────────────────────────────────────────
//
// Maps the handler name reported by `reportError` (and shown in the
// ConnectionErrorsPanel) to its register/deregister pair, so a single
// failed handler can be restarted without tearing down the others.

type HandlerPair = {
  register: () => void;
  deregister: () => void;
};

/** Restart a single handler by its reported name. */
function reloadHandler(handler: string, token: string) {
  const pairs: Record<string, HandlerPair> = {
    Twitch: {
      register: () => registerTwitchChatHandler(token, recipientId, eventbus!, emotesStore!),
      deregister: deregisterTwitchChatHandler,
    },
    VKLive: {
      register: () => registerVKLiveChatHandler(token, recipientId, eventbus!, emotesStore!),
      deregister: deregisterVKLiveChatHandler,
    },
    Kick: {
      register: () => registerKickChatHandler(token, recipientId, eventbus!, emotesStore!),
      deregister: deregisterKickChatHandler,
    },
    StreamElements: {
      register: () => registerStreamElementsHandler(token, recipientId, eventbus!),
      deregister: deregisterStreamElementsHandler,
    },
    DonationAlerts: {
      register: () => registerDonationAlertsHandler(token, recipientId),
      deregister: deregisterDonationAlertsHandler,
    },
    DonatePay: {
      register: () => registerDonatePayHandler(token, recipientId),
      deregister: deregisterDonatePayHandler,
    },
    "DonatePay.eu": {
      register: () => registerDonatePayEuHandler(token, recipientId),
      deregister: deregisterDonatePayEuHandler,
    },
    UnofficialDonationAlerts: {
      register: () => registerUnofficialDonationAlertsHandler(token, recipientId),
      deregister: deregisterUnofficialDonationAlertsHandler,
    },
    DonateX: {
      register: () => registerDonateXHandler(token, recipientId),
      deregister: deregisterDonateXHandler,
    },
  };

  const pair = pairs[handler];
  if (!pair) {
    console.warn(`No handler registered for name "${handler}"`);
    return;
  }
  pair.deregister();
  pair.register();
}

// ── Message dispatch ────────────────────────────────────────────────

addMessageListener((event: WorkerMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "USER_AUTHORIZED") return;
  if (connected) return;
  connected = true;

  console.log("main worker received USER_AUTHORIZED");

  const info = (data.payload ?? data) as Record<string, unknown>;
  recipientId = String(info.recipientId ?? "unknown");
  const token = String(info.token ?? "");
  tokens.set(recipientId, token);

  const features = (info.features ?? []) as Feature[];
  donationsEnabled = isFeatureEnabled(features, SW_DONATIONS_FEATURE);
  console.log(
    `SW_DONATIONS ${donationsEnabled ? "enabled" : "disabled"} — donation handlers ${donationsEnabled ? "will" : "will not"} be registered`,
  );

  eventbus = new DefaultEventBus(
    token,
    recipientId,
    broadcast,
    addMessageListener,
  );
  emotesStore = new DefaultEmotesStore();
  emotesStore.load("");

  // One-time handlers — registered once, never duplicated on reload.
  registerLogHandler(recipientId, addMessageListener);
  registerWorkerStatusHandler(addMessageListener);

  registerHandlers(token, recipientId);
});

addMessageListener((event: WorkerMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "Reload") return;

  console.log("main worker received Reload");

  const info = (data.payload ?? data) as Record<string, unknown>;
  const token = String(info.token ?? "");
  if (!token || !eventbus || !emotesStore) return;

  const handler = String(info.handler ?? "");
  if (handler) {
    // Restart only the failed handler.
    reloadHandler(handler, token);
    return;
  }

  deregisterHandlers();
  registerHandlers(token, recipientId);
});
