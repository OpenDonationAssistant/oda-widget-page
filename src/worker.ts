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

let worker: SharedWorker | null = null;
let port: MessagePort | null = null;

function workerUrl(): string {
  return `${process.env.PUBLIC_URL || ""}/logger-worker.js`;
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

/** Send a message to the logger-worker. No-op when SharedWorker is unavailable. */
export function sendMessageToWorker(message: Record<string, unknown>): void {
  const p = getWorkerPort();
  if (!p) return;
  p.postMessage(message);
}

/**
 * Subscribe to messages from the logger-worker.
 * Returns an unsubscribe function.
 */
export function onWorkerMessage(
  listener: (data: any) => void,
): () => void {
  const p = getWorkerPort();
  if (!p) return () => {};
  const handler = (event: MessageEvent) => listener(event.data);
  p.addEventListener("message", handler);
  return () => p.removeEventListener("message", handler);
}
