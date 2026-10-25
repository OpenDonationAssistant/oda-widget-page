/**
 * STOMP adapter contract (TYPES ONLY).
 *
 * Describes how the current `@stomp/stompjs` client in `src/socket.ts` maps
 * onto the `MessageBus` port. No implementation lives here — this is the
 * target shape for a later, behaviour-preserving refactor.
 *
 * Header mapping performed by the adapter's policy translation:
 *
 *   retainWhileOffline      -> durable: "true" | "false"
 *   removeWhenDisconnected  -> auto-delete: "true" | "false"
 *   acknowledgement         -> ack: "client" | "auto"
 *   messageTtlMs            -> x-message-ttl and x-expires (string ms)
 *   id + destination        -> x-queue-name and subscription id `${destination}-${id}`
 */

import type {
  DeliveryAcknowledgement,
  DeliveryPolicy,
  MessageBus,
  MessageBusConfig,
  ReconnectPolicy,
  TransportCapabilities,
} from "./MessageBus"

/** STOMP frame headers are a flat string map. */
export type StompHeaders = Readonly<Record<string, string>>

export type StompAcknowledgementMode = "auto" | "client"

export interface StompCapabilities extends TransportCapabilities {
  readonly protocol: "stomp"
  readonly manualAcknowledgement: true
  readonly deliveryGuarantees: readonly ["at-most-once", "at-least-once"]
  /** Multiple consumers may share a declared queue. */
  readonly sharedSubscriptions: true
  readonly retainedMessages: false
}

export interface StompConfig extends MessageBusConfig {
  /** Defaults applied when a `DeliveryPolicy` omits a field. */
  readonly defaults?: {
    readonly retainWhileOffline?: boolean
    readonly removeWhenDisconnected?: boolean
    readonly acknowledgement?: DeliveryAcknowledgement
    readonly messageTtlMs?: number
  }
}

/**
 * Result of translating a protocol-neutral policy into STOMP terms.
 * `x-queue-name` and the subscription id are derived from the listener id and
 * destination, preserving today's `${topic}-${id}` naming.
 */
export interface StompSubscriptionTranslation {
  readonly subscriptionId: string
  readonly queueName: string
  readonly headers: StompHeaders
}

/** Pure function shape the adapter uses; exported so it can be unit-tested. */
export type TranslateStompPolicy = (
  id: string,
  destination: string,
  policy: DeliveryPolicy,
) => StompSubscriptionTranslation

/** Reconnect defaults currently configured in `src/socket.ts`. */
export interface StompReconnectPolicy extends ReconnectPolicy {
  readonly backoff: "exponential"
}

export interface StompMessageBus extends MessageBus {
  readonly capabilities: StompCapabilities
}

export interface StompMessageBusFactory {
  create(config: StompConfig): StompMessageBus
}
