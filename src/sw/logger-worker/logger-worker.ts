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
import {
  register as registerYouTubeChatHandler,
  deregister as deregisterYouTubeChatHandler,
} from "./handlers/youtube-chat";
import { register as registerWidgetsHandler } from "./handlers/widgets";
import { register as registerWorkerStatusHandler } from "./worker-status";
import { onStatusChange } from "./worker-status";
import {
  isFeatureEnabled,
  SW_DONATIONS_FEATURE,
  type Feature,
} from "../../shared/features";
import type { WorkerProgressMessage, WorkerProgressStage } from "./types";
import { DefaultEventBus } from "../../bus/EventBus";
import { DefaultEmotesStore } from "../../stores/EmotesStore";
import { availableTokens, hasLinkedToken, type TokenDto } from "./systems";
import type { MessageListener, WorkerMessageEvent } from "./messaging";
import { log } from "./handlers/log";

/** Shared worker scope — cast from the generic `self`. */
const swScope = self as unknown as SharedWorkerGlobalScope;

const ports = new Set<MessagePort>();
function broadcast(msg: unknown) {
  for (const port of ports) {
    try {
      port.postMessage(msg);
    } catch {
      ports.delete(port);
    }
  }
}

const messageListeners = new Set<MessageListener>();
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
let currentTokens: TokenDto[] | null = null;

/** Latest boot progress — answered to `GetWorkerProgress` queries. */
let currentProgress: WorkerProgressMessage = {
  type: "WORKER_PROGRESS",
  stage: "starting",
  percent: 0,
  label: "Starting...",
};

const startedHandlers = new Set<string>();
const erroredHandlers = new Set<string>();
const expectedHandlers = new Set<string>();

function broadcastProgress(
  stage: WorkerProgressStage,
  percent: number,
  label: string,
) {
  currentProgress = { type: "WORKER_PROGRESS", stage, percent, label };
  broadcast(currentProgress);
}

function resolvedHandlerCount(): number {
  return new Set([...startedHandlers, ...erroredHandlers]).size;
}

function checkHandlersReady() {
  if (expectedHandlers.size === 0) return;
  if (resolvedHandlerCount() >= expectedHandlers.size) {
    broadcastProgress("ready", 100, "Ready");
  }
}

/**
 * Register handlers that can be deregistered and re-registered with a
 * (possibly new) token. Event bus and emotes store are reused, so the
 * handlers keep feeding events into the same bus after a reload.
 *
 * A handler is only registered — and only waited on for status updates —
 * when the recipient has a linked token for its system.
 */
async function registerHandlers(token: string, recipientId: string) {
  expectedHandlers.clear();
  startedHandlers.clear();
  erroredHandlers.clear();

  currentTokens = await availableTokens(token);
  const hasSystem = (handler: string) => hasLinkedToken(currentTokens, handler);

  expectedHandlers.add("ODA");
  registerCoreHandlers(token, recipientId, currentTokens, hasSystem);
  if (donationsEnabled) {
    registerDonationHandlers(token, recipientId, currentTokens, hasSystem);
  }
}

/**
 * Chat handlers (gated on a linked token) plus the widgets handler, which is
 * always registered.
 */
function registerCoreHandlers(
  token: string,
  recipientId: string,
  tokens: TokenDto[] | null,
  hasSystem: (handler: string) => boolean,
) {
  const registrations: Array<[string, () => void]> = [
    [
      "Twitch",
      () =>
        registerTwitchChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          tokens,
        ),
    ],
    [
      "VKLive",
      () =>
        registerVKLiveChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          tokens,
        ),
    ],
    [
      "Kick",
      () =>
        registerKickChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          tokens,
        ),
    ],
    [
      "Youtube",
      () =>
        registerYouTubeChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          tokens,
        ),
    ],
  ];
  for (const [handler, register] of registrations) {
    if (!hasSystem(handler)) {
      log("INFO", `[worker] skipping ${handler} — no linked token`);
      continue;
    }
    expectedHandlers.add(handler);
    register();
  }
  registerWidgetsHandler(token, recipientId, addMessageListener);
}

/**
 * Donation handlers — only registered when SW_DONATIONS is enabled and the
 * system has a linked token.
 */
function registerDonationHandlers(
  token: string,
  recipientId: string,
  tokens: TokenDto[] | null,
  hasSystem: (handler: string) => boolean,
) {
  const registrations: Array<[string, () => void]> = [
    [
      "StreamElements",
      () => registerStreamElementsHandler(token, recipientId, eventbus!, tokens),
    ],
    [
      "DonationAlerts",
      () => registerDonationAlertsHandler(token, recipientId, tokens),
    ],
    ["DonatePay", () => registerDonatePayHandler(token, recipientId, tokens)],
    [
      "DonatePay.eu",
      () => registerDonatePayEuHandler(token, recipientId, tokens),
    ],
    [
      "UnofficialDonationAlerts",
      () => registerUnofficialDonationAlertsHandler(token, recipientId, tokens),
    ],
    ["DonateX", () => registerDonateXHandler(token, recipientId, tokens)],
  ];
  for (const [handler, register] of registrations) {
    if (!hasSystem(handler)) {
      log("INFO", `[worker] skipping ${handler} — no linked token`);
      continue;
    }
    expectedHandlers.add(handler);
    register();
  }
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
  deregisterYouTubeChatHandler();
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
async function reloadHandler(handler: string, token: string) {
  const freshTokens = await availableTokens(token);
  currentTokens = freshTokens;
  const pairs: Record<string, HandlerPair> = {
    Twitch: {
      register: () =>
        registerTwitchChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          freshTokens,
        ),
      deregister: deregisterTwitchChatHandler,
    },
    VKLive: {
      register: () =>
        registerVKLiveChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          freshTokens,
        ),
      deregister: deregisterVKLiveChatHandler,
    },
    Kick: {
      register: () =>
        registerKickChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          freshTokens,
        ),
      deregister: deregisterKickChatHandler,
    },
    Youtube: {
      register: () =>
        registerYouTubeChatHandler(
          token,
          recipientId,
          eventbus!,
          emotesStore!,
          freshTokens,
        ),
      deregister: deregisterYouTubeChatHandler,
    },
    StreamElements: {
      register: () =>
        registerStreamElementsHandler(token, recipientId, eventbus!, freshTokens),
      deregister: deregisterStreamElementsHandler,
    },
    DonationAlerts: {
      register: () => registerDonationAlertsHandler(token, recipientId, freshTokens),
      deregister: deregisterDonationAlertsHandler,
    },
    DonatePay: {
      register: () => registerDonatePayHandler(token, recipientId, freshTokens),
      deregister: deregisterDonatePayHandler,
    },
    "DonatePay.eu": {
      register: () => registerDonatePayEuHandler(token, recipientId, freshTokens),
      deregister: deregisterDonatePayEuHandler,
    },
    UnofficialDonationAlerts: {
      register: () =>
        registerUnofficialDonationAlertsHandler(token, recipientId, freshTokens),
      deregister: deregisterUnofficialDonationAlertsHandler,
    },
    DonateX: {
      register: () => registerDonateXHandler(token, recipientId, freshTokens),
      deregister: deregisterDonateXHandler,
    },
  };

  const pair = pairs[handler];
  if (!pair) {
    log("WARN", `No handler registered for name "${handler}"`);
    return;
  }
  pair.deregister();
  pair.register();
}

addMessageListener((event: WorkerMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "USER_AUTHORIZED") return;
  if (connected) return;
  connected = true;

  broadcastProgress("starting", 0, "Starting worker...");

  const info = (data.payload ?? data) as Record<string, unknown>;
  recipientId = String(info.recipientId ?? "unknown");
  const token = String(info.token ?? "");
  tokens.set(recipientId, token);

  const features = (info.features ?? []) as Feature[];
  donationsEnabled = isFeatureEnabled(features, SW_DONATIONS_FEATURE);

  // One-time handlers — registered once, never duplicated on reload.
  // The log handler must be registered before any log() call so the SW_LOGS
  // feature gate is applied to bootstrap diagnostics too.
  registerLogHandler(recipientId, addMessageListener, features);
  registerWorkerStatusHandler(addMessageListener);

  log("INFO", "main worker received USER_AUTHORIZED");
  log("INFO",
    `SW_DONATIONS ${donationsEnabled ? "enabled" : "disabled"} — donation handlers ${donationsEnabled ? "will" : "will not"} be registered`,
  );

  broadcastProgress("eventbus", 20, "Connecting to event bus...");
  eventbus = new DefaultEventBus(
    token,
    recipientId,
    broadcast,
    addMessageListener,
  );
  emotesStore = new DefaultEmotesStore({
    onEmotesLoaded: (urls) => {
      broadcast({ type: "EMOTES_LOADED", urls });
    },
  });

  broadcastProgress("emotes", 40, "Loading emotes...");
  emotesStore.load();

  broadcastProgress("handlers", 60, "Connecting to platforms...");
  registerHandlers(token, recipientId);
});

addMessageListener((event: WorkerMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "Reload") return;

  log("INFO", "main worker received Reload");

  const info = (data.payload ?? data) as Record<string, unknown>;
  const token = String(info.token ?? "");
  if (!token || !eventbus || !emotesStore) return;

  const handler = String(info.handler ?? "");
  if (handler) {
    // Restart only the failed handler.
    void reloadHandler(handler, token);
    return;
  }

  deregisterHandlers();
  registerHandlers(token, recipientId);
});

addMessageListener((event: WorkerMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "GetWorkerProgress") return;
  event.port.postMessage(currentProgress);
});

// ── Handler readiness tracking ──────────────────────────────────────
//
// Each chat/donation handler calls reportStarted() on successful
// connection. We listen for those events and track progress toward the
// "ready" state where all expected handlers are connected.

onStatusChange((message) => {
  broadcast({ type: "WORKER_STATUS_CHANGED", status: message });

  if (message.type === "HandlerStarted") {
    if (startedHandlers.has(message.handler)) return;
    startedHandlers.add(message.handler);
  } else if (message.type === "HandlerError") {
    if (erroredHandlers.has(message.handler)) return;
    erroredHandlers.add(message.handler);
  } else {
    return;
  }

  const handlerCount = resolvedHandlerCount();
  const totalExpected = expectedHandlers.size || 1;
  const percent = Math.min(
    60 + Math.round((handlerCount / totalExpected) * 38),
    98,
  );
  broadcastProgress(
    "handlers",
    percent,
    `Connecting to platforms... (${handlerCount}/${totalExpected})`,
  );
  checkHandlersReady();
});
