/**
 * SharedWorker connection singleton for the logger-worker.
 *
 * The logger-worker runs as a SharedWorker (not a service worker). Every
 * page that needs it constructs `new SharedWorker(url, { name })` with the
 * same URL and name, so the browser hands them all the same worker instance
 * and each page gets its own `MessagePort`.
 *
 * This module lazily creates the connection on first use and exposes the
 * two operations the rest of the app needs: sending a message to the worker
 * and subscribing to messages coming back from it.
 */

import { addWarning } from "@opendonationassistant/news-service";

// Endpoint comes from the build-time environment, with a fallback to the
// production gateway.
const NEWS_API_ENDPOINT =
  process.env.REACT_APP_NEWS_API_ENDPOINT ?? "https://api.oda.digital";

let worker: SharedWorker | null = null;
let port: MessagePort | null = null;

/**
 * Absolute URL of the logger SharedWorker script.
 *
 * Custom widget documents are served from `blob:` URLs, where relative URLs
 * cannot be resolved — `new SharedWorker("/logger-worker.js")` throws
 * `DOMException: An invalid or illegal string was specified`. Resolving the
 * path against the page origin gives an absolute URL that the host page and
 * every widget iframe can use, so they all join the same worker instance.
 */
export function workerUrl(): string {
  const path = `${process.env.PUBLIC_URL || ""}/logger-worker.js`;
  return new URL(path, window.location.origin).href;
}

export function isWorkerSupported(): boolean {
  return typeof SharedWorker !== "undefined";
}

/** Lazily create (once) and return the worker port, or null if unsupported. */
export function getWorkerPort(): MessagePort | null {
  if (!isWorkerSupported()) {
    return null;
  }
  if (!worker) {
    worker = new SharedWorker(workerUrl(), { name: "logger-worker" });
    port = worker.port;
    port.start();
  }
  return port;
}

/**
 * Send a message to the logger-worker. No-op when SharedWorker is unavailable.
 *
 * When the environment does not support SharedWorker, the logger-worker
 * cannot run at all — report that to the backend (with the recipient id)
 * so the missing realtime services are visible instead of silently absent.
 */
export function sendMessageToWorker(message: Record<string, unknown>): void {
  if (!isWorkerSupported()) {
    reportWorkerUnavailable(message);
    return;
  }
  const p = getWorkerPort();
  if (!p) return;
  p.postMessage(message);
}

function reportWorkerUnavailable(message: Record<string, unknown>): void {
  // Only the USER_AUTHORIZED bootstrap carries the recipient id — warn once
  // per page load, not for every LOG/status message.
  if (message.type !== "USER_AUTHORIZED") return;
  const info = (message.payload ?? message) as Record<string, unknown>;
  const recipientId = String(info.recipientId ?? "unknown");
  const token = String(info.token ?? "");
  addWarning({
    baseURL: NEWS_API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      message: `SharedWorker is not supported in this browser (recipientId: ${recipientId})`,
      priority: "warning",
    },
  });
}

/**
 * Subscribe to messages from the logger-worker.
 * Returns an unsubscribe function.
 */
export function onWorkerMessage(listener: (data: any) => void): () => void {
  const p = getWorkerPort();
  if (!p) return () => {};
  const handler = (event: MessageEvent) => listener(event.data);
  p.addEventListener("message", handler);
  return () => p.removeEventListener("message", handler);
}
