/// <reference lib="webworker" />

import { buildOtelPayload } from "../otel-payload";
import type { LogRecord } from "../types";
import type {
  MessageListenerRegistrar,
  WorkerMessageEvent,
} from "../messaging";
import {
  isFeatureEnabled,
  SW_LOGS_FEATURE,
  type Feature,
} from "../../../shared/features";

// ── Configuration ───────────────────────────────────────────────────

const OTEL_ENDPOINT = "https://api.oda.digital/logs";
const BATCH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 10;
const FLUSH_TIMEOUT_MS = 5000;

// ── State ──────────────────────────────────────────────────────────

let logQueue: LogRecord[] = [];
let currentRecipientId = "unknown";
let logsEnabled = false;

// ── Publishing ─────────────────────────────────────────────────────

function stringify(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

/**
 * Publish a log record through the OTEL log queue. Worker handlers use this
 * instead of `console.*` so their diagnostics reach the same log sink as the
 * main thread (which sends `{ type: "LOG", log }` messages).
 *
 * Gated by the SW_LOGS feature flag on the recipient — when disabled, records
 * are dropped and nothing is published.
 */
export function log(level: string, ...args: unknown[]): void {
  if (!logsEnabled) return;
  console.log(level, ...args);
  logQueue.push({
    level,
    messages: args.map(stringify).join(";"),
    ts: Date.now(),
  });
}

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
      signal: AbortSignal.timeout(FLUSH_TIMEOUT_MS),
    });
  } catch {}
}

setInterval(flushQueue, BATCH_INTERVAL_MS);

export function register(
  recipientId: string,
  addMessageListener: MessageListenerRegistrar,
  features: Feature[],
): void {
  currentRecipientId = recipientId;
  logsEnabled = isFeatureEnabled(features, SW_LOGS_FEATURE);
  addMessageListener((event: WorkerMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data) return;

    // Accept typed { type: "LOG", log } and legacy { log } (no type field).
    const isLog = data.type === "LOG" || (!data.type && data.log);
    if (!isLog) return;

    logQueue.push(data.log as LogRecord);
  });
}
