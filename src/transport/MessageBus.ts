/**
 * MessageBus — transport-agnostic port for broker-backed pub/sub.
 *
 * This module is TYPES ONLY. It defines the contract a concrete transport
 * adapter (STOMP today, MQTT optionally) must satisfy. Nothing here is
 * imported by application code yet, so runtime behaviour is unchanged.
 *
 * Design intent: callers describe *what* they need — a destination plus a
 * delivery policy — and never see protocol-specific header names, client ids
 * or queue declarations. Each adapter translates the policy onto its own
 * broker semantics.
 *
 * Policy mapping reference (adapter responsibility):
 *
 *   retainWhileOffline      STOMP `durable`                 MQTT `clean: false`
 *   removeWhenDisconnected  STOMP `auto-delete`             MQTT `clean: true`
 *   acknowledgement         STOMP `ack: client | auto`      MQTT auto (QoS 1 PUBACK)
 *   messageTtlMs            STOMP `x-message-ttl`/`x-expires` MQTT session expiry
 *   destination             STOMP literal destination       MQTT `/` -> `.` topic
 */

/** Serialized message body. JSON encoding remains a caller/adapter concern. */
export type MessageBody = string;

/** Transport-neutral message metadata, flattened to strings. */
export type MessageHeaders = Readonly<Record<string, string>>;

export interface IncomingMessage {
  readonly destination: string;
  readonly body: MessageBody;
  readonly headers: MessageHeaders;
  /**
   * Confirm successful handling. Transports that acknowledge automatically
   * (e.g. MQTT QoS 1) implement this as a no-op so call sites stay uniform.
   */
  ack(): void;
  /** Reject or request redelivery. No-op where the transport has no nack. */
  nack(): void;
}

export type MessageHandler = (message: IncomingMessage) => void;

/** Who is responsible for acknowledging a delivered message. */
export type DeliveryAcknowledgement = "auto" | "client";

export type DeliveryGuarantee =
  | "at-most-once"
  | "at-least-once"
  | "exactly-once";

/**
 * Protocol-neutral description of how a subscription should behave.
 * Omitted fields are resolved by the adapter to its documented defaults.
 */
export interface DeliveryPolicy {
  /** Broker keeps messages for this subscription while the client is offline. */
  retainWhileOffline?: boolean;
  /** Subscription is torn down when the client disconnects. */
  removeWhenDisconnected?: boolean;
  /** `client` requires the handler to call ack()/nack(). */
  acknowledgement?: DeliveryAcknowledgement;
  /** Maximum age of an undelivered message, in milliseconds. */
  messageTtlMs?: number;
}

/** A policy after adapter defaults have been applied. */
export interface ResolvedDeliveryPolicy {
  readonly retainWhileOffline: boolean;
  readonly removeWhenDisconnected: boolean;
  readonly acknowledgement: DeliveryAcknowledgement;
  readonly messageTtlMs: number;
}

export type MessageBusState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed";

export interface ReconnectPolicy {
  readonly initialDelayMs: number;
  readonly maxDelayMs: number;
  readonly backoff: "linear" | "exponential";
  /** Heartbeat / keepalive interval in milliseconds. */
  readonly heartbeatMs?: number;
}

export interface MessageBusConfig {
  readonly endpoint: string;
  /**
   * Stable identity for the session. Adapters that key server-side state on
   * it (MQTT client id) require callers to keep it stable across reconnects.
   */
  readonly clientId?: string;
  readonly connectHeaders?: MessageHeaders;
  readonly reconnect?: ReconnectPolicy;
}

export interface PublishOptions {
  readonly headers?: MessageHeaders;
  readonly ttlMs?: number;
}

export interface SubscriptionHandle {
  readonly id: string;
  readonly destination: string;
  readonly policy: ResolvedDeliveryPolicy;
  unsubscribe(): void;
}

/**
 * What an adapter supports. Declared as literal types per adapter so gaps
 * (QoS 2, shared subscriptions) surface at compile time, not at runtime.
 */
export interface TransportCapabilities {
  readonly protocol: "stomp" | "mqtt";
  readonly manualAcknowledgement: boolean;
  readonly deliveryGuarantees: readonly DeliveryGuarantee[];
  readonly sharedSubscriptions: boolean;
  readonly retainedMessages: boolean;
}

export type StateListener = (state: MessageBusState) => void;
export type ErrorListener = (error: Error) => void;

/**
 * The port. A single logical connection to the broker, through which callers
 * subscribe to destinations and publish messages.
 *
 * `subscribe`/`unsubscribe` mirror the current `src/socket.ts` signature so an
 * adapter can later replace it without touching the 20 consumer modules:
 *
 *   subscribe(id, destination, handler, policy?)
 *   unsubscribe(id, destination)
 */
export interface MessageBus {
  readonly capabilities: TransportCapabilities;
  readonly state: MessageBusState;

  subscribe(
    id: string,
    destination: string,
    handler: MessageHandler,
    policy?: DeliveryPolicy,
  ): SubscriptionHandle;

  unsubscribe(id: string, destination: string): void;

  publish(
    destination: string,
    body: MessageBody,
    options?: PublishOptions,
  ): void;

  /** Registers a listener and returns its unsubscribe function. */
  onStateChange(listener: StateListener): () => void;
  onError(listener: ErrorListener): () => void;

  close(): void;
}

/** Creates a `MessageBus` for a given transport implementation. */
export interface MessageBusFactory {
  create(config: MessageBusConfig): MessageBus;
}
