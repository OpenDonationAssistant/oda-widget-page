/// <reference lib="webworker" />

import { buildOtelPayload } from "./logger-worker/otel-payloadd";
import type { LogRecord, WorkerIncomingMessage } from "./logger-worker/typess";

/** Service worker scope — cast from the generic `self`. */
const swScope = self as unknown as ServiceWorkerGlobalScope;

// ── Configuration ───────────────────────────────────────────────────

/** OTEL endpoint for log ingestion. */
const OTEL_ENDPOINT = "https://api.oda.digital/logs";

/** How often (ms) to flush the log queue. */
const BATCH_INTERVAL_MS = 2000;

/** Max number of log records sent in a single request. */
const MAX_BATCH_SIZE = 10;

// ── State ──────────────────────────────────────────────────────────

let logQueue: LogRecord[] = [];
let recipientId = "unknown";
let features: { name: string; state: string }[] = [];

// ── Log flusher ─────────────────────────────────────────────────────

async function flushQueue(): Promise<void> {
  if (logQueue.length === 0) return;

  const batch = logQueue.splice(0, MAX_BATCH_SIZE);
  try {
    await fetch(OTEL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOtelPayload(batch)),
      keepalive: true,
    });
  } catch {
    // Silently drop — retrying would require re-queueing which can
    // lead to loops. The next interval will pick up new entries.
  }
}

setInterval(flushQueue, BATCH_INTERVAL_MS);

// ── Lifecycle ───────────────────────────────────────────────────────

swScope.addEventListener("install", () => {
  swScope.skipWaiting();
});

swScope.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(swScope.clients.claim());
});

// ── Message handling ────────────────────────────────────────────────

/**
 * Normalize an incoming message to a typed shape.
 * Handles both flat and payload-wrapped formats for backward compat.
 */
function normalizeMessage(
  data: Record<string, unknown>,
): WorkerIncomingMessage | null {
  if (!data || typeof data !== "object") return null;

  const type = data.type as string | undefined;

  // LOG messages
  if (type === "LOG" && data.log) {
    return {
      type: "LOG",
      log: data.log as LogRecord,
    };
  }

  // USER_AUTHORIZED — two possible shapes:
  //   flat:  { type, recipientId, features }
  //   wrapped: { type, payload: { recipientId, features } }
  if (
    type === "USER_AUTHORIZED" ||
    (data as Record<string, unknown>).recipientId ||
    (data as Record<string, unknown>).payload
  ) {
    const payload = data as Record<string, unknown>;
    const info = (payload.payload ?? payload) as Record<string, unknown>;
    return {
      type: "USER_AUTHORIZED",
      recipientId: String(info.recipientId ?? ""),
      features: Array.isArray(info.features) ? (info.features as { name: string; state: string }[]) : [],
    };
  }

  return null;
}

swScope.addEventListener("message", (event: ExtendableMessageEvent) => {
  const msg = normalizeMessage(
    event.data as Record<string, unknown>,
  );
  if (!msg) return;

  switch (msg.type) {
    case "USER_AUTHORIZED":
      recipientId = msg.recipientId;
      features = msg.features;
      break;

    case "LOG":
      logQueue.push(msg.log);
      break;
  }
});
