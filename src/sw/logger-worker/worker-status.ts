/// <reference lib="webworker" />

// ── Worker status reporting ─────────────────────────────────────────
//
// Handlers report connection lifecycle events (started / error) into a
// shared map keyed by handler name. The logger-worker returns the map
// to clients that send a `GetWorkersStatus` message.

export interface WorkerStatusMessage {
  type: "HandlerStarted" | "HandlerError";
  handler: string;
  message?: string;
  timestamp: number;
}

const statuses = new Map<string, WorkerStatusMessage>();

export function reportStarted(handler: string): void {
  statuses.set(handler, {
    type: "HandlerStarted",
    handler,
    timestamp: Date.now(),
  });
  console.log(`[worker-status] ${handler} started`);
}

export function reportError(handler: string, message: string): void {
  statuses.set(handler, {
    type: "HandlerError",
    handler,
    message,
    timestamp: Date.now(),
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

export function register(sw: ServiceWorkerGlobalScope): void {
  sw.addEventListener("message", (event: ExtendableMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data || typeof data.type !== "string") return;
    if (data.type === "GetWorkersStatus") {
      event.source?.postMessage({
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
