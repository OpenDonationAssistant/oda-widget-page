/// <reference lib="webworker" />

import { register as registerLogHandler } from "./handlers/log";
import { register as registerTwitchChatHandler } from "./handlers/twitch-chat";
import { DefaultEventBus } from "../../bus/EventBus";

/** Service worker scope — cast from the generic `self`. */
const swScope = self as unknown as ServiceWorkerGlobalScope;

// ── Lifecycle ───────────────────────────────────────────────────────

swScope.addEventListener("install", () => {
  swScope.skipWaiting();
});

swScope.addEventListener("activate", (event) => {
  event.waitUntil(swScope.clients.claim());
});

// ── Register message handlers ───────────────────────────────────────
//
//
let connected = false;

swScope.addEventListener("message", (event: ExtendableMessageEvent) => {
  const data = event.data as Record<string, unknown> | undefined;
  if (!data || data.type !== "USER_AUTHORIZED") return;
  if (connected) return;
  connected = true;

  console.log("main worker received USER_AUTHORIZED");

  const info = (data.payload ?? data) as Record<string, unknown>;
  const recipientId = String(info.recipientId ?? "");
  const eventbus = new DefaultEventBus(recipientId, swScope);
  registerLogHandler(swScope);
  registerTwitchChatHandler(info.token, eventbus, swScope);
});
