/**
 * MQTT adapter contract (TYPES ONLY).
 *
 * Documents how an MQTT transport (`mqtt` / MQTT.js over WSS to RabbitMQ's
 * `rabbitmq_web_mqtt` plugin) would satisfy the `MessageBus` port. No
 * implementation lives here, and no dependency is added.
 *
 * Mapping performed by the adapter's policy translation:
 *
 *   retainWhileOffline      -> connect/session option `clean: false`
 *   removeWhenDisconnected  -> connect/session option `clean: true`
 *   acknowledgement         -> handled by the client; ack()/nack() are no-ops
 *   messageTtlMs            -> MQTT 5 `properties.sessionExpiryInterval`
 *   destination             -> topic, with `/` translated to `.` for AMQP
 *
 * Known RabbitMQ constraints captured by the capability literals below:
 *   - QoS 2 is unsupported (3.x downgrades to 1; 5.0 disconnects, reason 155).
 *   - Shared subscriptions are unsupported; each client id gets a private
 *     `mqtt-subscription-<clientId>qos[0|1]` queue.
 *   - Retained messages are node-local and not delivered for wildcards.
 *   - OAuth tokens cannot be renewed mid-connection; reconnect to refresh.
 */

import type {
  DeliveryPolicy,
  MessageBus,
  MessageBusConfig,
  ReconnectPolicy,
  TransportCapabilities,
} from "./MessageBus"

/** 4 = MQTT 3.1.1, 5 = MQTT 5.0 (RabbitMQ 3.13+ with the `mqtt_v5` flag). */
export type MqttProtocolVersion = 4 | 5

/** RabbitMQ's MQTT plugin caps at QoS 1. */
export type MqttQos = 0 | 1

export interface MqttCapabilities extends TransportCapabilities {
  readonly protocol: "mqtt"
  /** PUBACK is automated by the client; ack()/nack() are no-ops. */
  readonly manualAcknowledgement: false
  readonly deliveryGuarantees: readonly ["at-most-once", "at-least-once"]
  readonly sharedSubscriptions: false
  readonly retainedMessages: true
  readonly qosLevels: readonly [0, 1]
}

export interface MqttConfig extends MessageBusConfig {
  readonly protocolVersion?: MqttProtocolVersion
  readonly keepaliveSeconds?: number
  /**
   * Must stay stable across reconnects to reuse the broker-side session.
   * RabbitMQ terminates the previous connection on a duplicate client id.
   */
  readonly clientId: string
}

export interface MqttReconnectPolicy extends ReconnectPolicy {
  readonly backoff: "exponential"
}

/** Protocol-neutral policy expressed in MQTT terms. */
export interface MqttSubscriptionTranslation {
  readonly topic: string
  readonly qos: MqttQos
  readonly clean: boolean
  readonly sessionExpirySeconds?: number
}

export type TranslateMqttPolicy = (
  destination: string,
  policy: DeliveryPolicy,
) => MqttSubscriptionTranslation

export interface MqttMessageBus extends MessageBus {
  readonly capabilities: MqttCapabilities
}

export interface MqttMessageBusFactory {
  create(config: MqttConfig): MqttMessageBus
}
