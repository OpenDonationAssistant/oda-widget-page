/**
 * SharedWorker message dispatch types.
 *
 * The logger-worker runs as a SharedWorker: every connected client gets a
 * `MessagePort`. Handlers register a listener once (via `addMessageListener`)
 * and receive every message from every port, with the originating port
 * attached so they can reply to the right client.
 */

export interface WorkerMessageEvent {
  data: unknown;
  port: MessagePort;
}

export type MessageListener = (event: WorkerMessageEvent) => void;

/** Registers a listener that receives messages from all connected ports. */
export type MessageListenerRegistrar = (listener: MessageListener) => void;
