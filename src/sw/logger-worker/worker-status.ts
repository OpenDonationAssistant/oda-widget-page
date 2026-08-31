/// <reference lib="webworker" />

// ── Worker status reporting ─────────────────────────────────────────
//
// Handlers report connection lifecycle events (started / error) into a
// shared map keyed by handler name. The logger-worker returns the map
// to clients that send a `GetWorkersStatus` message.
import { addWarning, clearWarnings } from "@opendonationassistant/news-service";
import type { MessageListenerRegistrar, WorkerMessageEvent } from "./messaging";

export interface WorkerStatusMessage {
  type: "HandlerStarted" | "HandlerError";
  handler: string;
  message?: string;
  timestamp: number;
}

const statuses = new Map<string, WorkerStatusMessage>();

export function reportStarted(token: string, handler: string): void {
  statuses.set(handler, {
    type: "HandlerStarted",
    handler,
    timestamp: Date.now(),
  });
  clearWarnings({
    baseURL: process.env.REACT_APP_NEWS_API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { components: [handler] },
  });
  console.log(`[worker-status] ${handler} started`);
}

export function reportError(
  token: string,
  handler: string,
  message: string,
): void {
  statuses.set(handler, {
    type: "HandlerError",
    handler,
    message,
    timestamp: Date.now(),
  });
  addWarning({
    baseURL: "https://api.oda.digital",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      message: `Worker ${handler} error: ${message}`,
      component: handler,
    },
  });
  console.error(`[worker-status] ${handler} error: ${message}`);
}

export function removeStatuses(handler: string): void {
  statuses.delete(handler);
  console.log(`[worker-status] ${handler} status removed`);
}

export function getStatuses(): Map<string, WorkerStatusMessage> {
  return statuses;
}

export function register(addMessageListener: MessageListenerRegistrar): void {
  addMessageListener((event: WorkerMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data || typeof data.type !== "string") return;
    if (data.type === "GetWorkersStatus") {
      event.port.postMessage({
        type: "WorkersStatus",
        statuses: getStatuses(),
      });
    } else if (
      data.type === "RemoveWorkersStatus" &&
      typeof data.handler === "string"
    ) {
      removeStatuses(data.handler);
    }
  });
}
