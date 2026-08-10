/// <reference lib="webworker" />

import { EventBus } from "../../../bus/EventBus";

/**
 * Events listener handler.
 *
 * The events topic (`/topic/{recipientId}.events`) is already consumed by
 * the DefaultEventBus, which converts each message into an `Event` and
 * broadcasts it to all window clients. Pages receive those events via
 * `onEvent()` from `src/utils.ts`.
 *
 * This handler is registered as the designated owner of the events topic
 * in the service worker. It is intentionally lightweight: the actual
 * subscription and broadcast are handled by the DefaultEventBus.
 */
export function register(
  token: string,
  _eventbus: EventBus,
  _sw: ServiceWorkerGlobalScope,
): void {
  console.log({ token }, "events-listener registered");
}