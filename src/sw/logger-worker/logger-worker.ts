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
import { DefaultEventBus } from "../../bus/EventBus";
import { DefaultEmotesStore } from "../../stores/EmotesStore";

/** Service worker scope — cast from the generic `self`. */
const swScope = self as unknown as ServiceWorkerGlobalScope;

// ── Lifecycle ───────────────────────────────────────────────────────

swScope.addEventListener("install", () => {
  swScope.skipWaiting();
});

swScope.addEventListener("activate", (event) => {
  event.waitUntil(swScope.clients.claim());
  console.log("main worker activated");
});

// ── Register message handlers ───────────────────────────────────────
//
//
let connected = false;
const tokens = new Map<String, String>();
let eventbus: DefaultEventBus | null = null;
let emotesStore: DefaultEmotesStore | null = null;

/**
 * Register handlers that can be deregistered and re-registered with a
 * (possibly new) token. Event bus and emotes store are reused, so the
 * handlers keep feeding events into the same bus after a reload.
 */
function registerHandlers(token: string) {
  registerStreamElementsHandler(token, eventbus!);
  registerTwitchChatHandler(token, eventbus!, emotesStore!);
  registerVKLiveChatHandler(token, eventbus!, emotesStore!);
  registerKickChatHandler(token, eventbus!, emotesStore!);
  registerWidgetsHandler(token, swScope);
  registerDonationAlertsHandler(token);
  registerDonatePayHandler(token);
  registerDonatePayEuHandler(token);
  registerUnofficialDonationAlertsHandler(token);
  registerDonateXHandler(token);
}

/** Deregister all handlers that support it. */
function deregisterHandlers() {
  deregisterDonationAlertsHandler();
  deregisterDonatePayEuHandler();
  deregisterDonatePayHandler();
  deregisterDonateXHandler();
  deregisterKickChatHandler();
  deregisterStreamElementsHandler();
  deregisterTwitchChatHandler();
  deregisterUnofficialDonationAlertsHandler();
  deregisterVKLiveChatHandler();
}

swScope.addEventListener("message", (event: ExtendableMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "USER_AUTHORIZED") return;
  if (connected) return;
  connected = true;

  console.log("main worker received USER_AUTHORIZED");

  const info = (data.payload ?? data) as Record<string, unknown>;
  const recipientId = String(info.recipientId ?? "");
  const token = String(info.token ?? "");
  tokens.set(recipientId, token);

  eventbus = new DefaultEventBus(token, recipientId, swScope);
  emotesStore = new DefaultEmotesStore();
  emotesStore.load("");

  // One-time handlers — registered once, never duplicated on reload.
  registerLogHandler(swScope);
  registerWorkerStatusHandler(swScope);

  registerHandlers(token);
});

swScope.addEventListener("message", (event: ExtendableMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "Reload") return;

  console.log("main worker received Reload");

  const info = (data.payload ?? data) as Record<string, unknown>;
  const token = String(info.token ?? "");
  if (!token || !eventbus || !emotesStore) return;

  deregisterHandlers();
  registerHandlers(token);
});

