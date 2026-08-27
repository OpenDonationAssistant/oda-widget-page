/// <reference lib="webworker" />

import { buildOtelPayload } from "../otel-payload";
import type { LogRecord } from "../types";

// ── Configuration ───────────────────────────────────────────────────

const OTEL_ENDPOINT = "https://api.oda.digital/logs";
const BATCH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 10;

// ── State ──────────────────────────────────────────────────────────

let logQueue: LogRecord[] = [];
let currentRecipientId = "unknown";

// ── Flusher ─────────────────────────────────────────────────────────

async function flushQueue(): Promise<void> {
  if (logQueue.length === 0) return;

  const batch = logQueue.splice(0, MAX_BATCH_SIZE);
  try {
    await fetch(OTEL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOtelPayload(currentRecipientId, batch)),
      keepalive: true,
    });
  } catch {}
}

setInterval(flushQueue, BATCH_INTERVAL_MS);

export function register(recipientId: string, sw: ServiceWorkerGlobalScope): void {
  currentRecipientId = recipientId;
  sw.addEventListener("message", (event: ExtendableMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data) return;

    // Accept typed { type: "LOG", log } and legacy { log } (no type field).
    const isLog = data.type === "LOG" || (!data.type && data.log);
    if (!isLog) return;

    logQueue.push(data.log as LogRecord);
  });
}
