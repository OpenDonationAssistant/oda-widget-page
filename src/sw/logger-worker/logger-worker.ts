/// <reference lib="webworker" />

import { register as registerDonationAlertsHandler } from "./handlers/donationalerts-shim";
import { register as registerDonatePayEuHandler } from "./handlers/donatepay-eu-shim";
import { register as registerDonatePayHandler } from "./handlers/donatepay-shim";
import { register as registerDonateXHandler } from "./handlers/donatex-shim";
import { register as registerKickChatHandler } from "./handlers/kick-chat";
import { register as registerLogHandler } from "./handlers/log";
import { register as registerStreamElementsHandler } from "./handlers/streamelements-shim";
import { register as registerTwitchChatHandler } from "./handlers/twitch-chat";
import { register as registerUnofficialDonationAlertsHandler } from "./handlers/unofficial-donationalerts-shim";
import { register as registerVKLiveChatHandler } from "./handlers/vklive-chat";
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

  const eventbus = new DefaultEventBus(recipientId, swScope);
  const emotesStore = new DefaultEmotesStore();
  emotesStore.load("");

  registerLogHandler(swScope);
  registerStreamElementsHandler(info.token, eventbus);
  registerTwitchChatHandler(info.token, eventbus, emotesStore);
  registerVKLiveChatHandler(info.token, eventbus, emotesStore);
  registerKickChatHandler(info.token, eventbus, emotesStore);
  registerWidgetsHandler(info.token, swScope);
  registerWorkerStatusHandler(swScope);
  registerDonationAlertsHandler(info.token);
  registerDonatePayHandler(info.token);
  registerDonatePayEuHandler(info.token);
  registerUnofficialDonationAlertsHandler(info.token);
  registerDonateXHandler(info.token);
});
