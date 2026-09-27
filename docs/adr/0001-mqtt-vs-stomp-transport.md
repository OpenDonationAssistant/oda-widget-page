# ADR 0001: Broker transport — keep STOMP, defer MQTT

**Date**: 2026-09-21
**Status**: Decided (migration deferred, re-evaluated on triggers)
**Owner**: Frontend / Architecture

## Context

`oda-widget-page` renders streaming widgets for OBS browser sources and configuration
pages. Realtime traffic today runs over **STOMP over WebSocket** to RabbitMQ.

There are **two independent STOMP clients**, both pointing at `REACT_APP_WS_ENDPOINT`
(`wss://api.oda.digital/ws`):

| # | Location | Runtime | Destination | Role |
|---|----------|---------|-------------|------|
| 1 | `src/socket.ts` | Main thread | `REACT_APP_WS_ENDPOINT` | Widget subscribe/publish. Imported by 20 modules. |
| 2 | `src/bus/EventBus.ts` | SharedWorker (`logger-worker.ts:438`) | `REACT_APP_WS_ENDPOINT` | Subscribes `/topic/<recipientId>.events`, persists to IndexedDB, relays to tabs. |

Important scope facts:

- The SharedWorker platform handlers (Twitch, Kick, Centrifugo, OBS, Meld) use **raw
  WebSocket** to third-party services. They are not STOMP and are unaffected by this
  decision.
- Subscription destinations are **server-supplied** by the config service
  (`REACT_APP_CONFIG_API_ENDPOINT/config/widgets?ownerId=…`). Only `/topic/commands`
  and `/topic/<recipientId>.events` are hardcoded client-side.
- The app relies on RabbitMQ-specific STOMP features: named durable queues
  (`x-queue-name`), `x-message-ttl` / `x-expires` (24h default), `auto-delete`,
  `durable`, and explicit client acknowledgement (`message.ack()`).

An option to migrate to MQTT was raised. This ADR records the assessment and the
decision.

## Decision

1. **Keep STOMP as the broker transport.** Do not migrate the wire protocol now.
2. **Introduce a type-only `MessageBus` port** (`src/transport/`) so the transport is an
   explicit, swappable seam. The port is declarative only — no runtime code, no wiring,
   no behaviour change.
3. **Re-evaluate MQTT only when a trigger in the Re-evaluation Triggers section fires.**

MQTT is a viable protocol but, for this application, is a lateral move at best and a
capability regression at worst. It removes broker-native control the app actively uses
while adding a cross-team backend dependency for no user-visible gain.

## Rationale

MQTT's headline advantages do not apply to this client:

| MQTT advantage | Applies here? | Why |
|---|---|---|
| Compact binary framing | No | Browsers cannot open raw TCP; MQTT is forced onto WebSocket, so both protocols ride identical WS frames. Bodies are JSON either way. |
| Optimised for constrained devices / unreliable links | No | Clients are Chrome (OBS browser source) and a desktop SharedWorker. |
| QoS 2 (exactly-once) | No | RabbitMQ's MQTT plugin does not support QoS 2. MQTT 3.x downgrades to 1; MQTT 5.0 disconnects with reason 155. Cap is QoS 1, which STOMP client-ack already provides. |
| Retained messages | Marginal | RabbitMQ's implementation is node-local, not cluster-replicated, capped at 2 GB/vhost, and not delivered for wildcard subscriptions. The app already gets store-and-forward through durable queues. |
| Shared subscriptions / consumer scale-out | No | Unsupported by RabbitMQ's MQTT plugin. |
| Persistent offline sessions | Marginal | Exists via `clean:false` + stable `clientId`, but keyed per client id rather than per listener `id`. Coarser than the current model. |
| Ecosystem / broker portability | Yes | The one genuine advantage. See Re-evaluation Triggers. |

Conversely, segmentation would lose:

- **Broker-native queue declaration.** `socket.ts` maps directly onto the AMQP model.
  MQTT hides this behind `amq.topic` and auto-generated
  `mqtt-subscription-<clientId>qos[0|1]` queues.
- **Explicit `message.ack()`** at roughly 15 call sites. Over MQTT, acknowledgement is
  automatic and the call becomes a no-op — a semantic change disguised as a refactor.
- **Per-listener identity.** `subscribe(id, destination, …)` collapses into one session
  per client id.
- **OAuth renewal resilience.** MQTT has no mid-connection re-authentication; on token
  expiry RabbitMQ disconnects (reason 160). STOMP is not exposed to this in the same way.
  Long-lived OBS sessions make this a real regression risk.

Additionally, MQTT topic names translate onto the AMQP topic exchange: MQTT `/` maps to
AMQP `.`, `+` maps to `*`. Destinations such as `/topic/<recipientId>.events` would be
remapped, requiring exact backend/frontend agreement.

## Alternatives Considered

| Alternative | Pros | Cons | Why Rejected? |
|---|---|---|---|
| **A. Keep STOMP as-is** (chosen baseline) | Zero migration risk; retains broker-native queue control and client ack | Protocol locked to RabbitMQ/ActiveMQ-style brokers | Chosen. No forcing function exists. |
| **B. Rewrite `socket.ts` internals to MQTT, preserve its signature** | Small frontend diff; 20 consumers untouched | Silent semantic change (ack becomes no-op); no rollback path; still needs backend MQTT listener and republished topics | Rejected as premature. The seam is better expressed as an explicit port (Decision 2) without changing the wire protocol now. |
| **C. Dual-transport adapter behind a feature flag** | Reversible; can be baked against real traffic; enables A/B | Highest frontend effort; still requires the full backend MQTT path to exist | Not now. This is the **preferred shape if a trigger fires**; the type-only port in Decision 2 is its first, zero-risk step. |
| **D. Full cutover and decommission STOMP** | One protocol; removes `@stomp/stompjs` and dead deps | All of C's cost plus irreversible loss of broker-native features | Rejected. End state at most, only after C is proven. |

## Impact

- **Positive**: No migration risk or coordination cost. The transport becomes an explicit
  seam, so a future swap is a contained adapter change rather than a 20-module refactor.
  The decision rationale is recorded so it is not re-litigated.
- **Negative**: Protocol remains coupled to RabbitMQ/ActiveMQ-family brokers; broker
  portability is deferred.
- **Risk**: `MessageBus` types could drift from reality if never exercised. Mitigation:
  when a trigger fires, build the STOMP adapter against the port first (pure refactor,
  no protocol change) to validate the contract before any MQTT work.

## Re-evaluation Triggers

Re-open this decision only if one or more of the following becomes true:

1. The platform team standardises all services on MQTT (then this is follow-the-decision,
   not a new evaluation).
2. A concrete broker-portability requirement appears — plans to leave RabbitMQ, or to
   serve non-RabbitMQ clients (mobile, IoT, partner integrations) from the same bus.
3. RabbitMQ STOMP support is retired in the target infrastructure.
4. A requirement specifically needs MQTT 5 features that STOMP cannot express.

If triggered, the migration path is: implement the STOMP adapter against the port (pure
refactor), then the MQTT adapter behind a flag (Alternative C), bake, and only then
decommission STOMP (Alternative D).

## Port and Adapter Design

The contract lives in `src/transport/` and is **type-level only**:

- `MessageBus.ts` — the transport-agnostic port: `MessageBus`, `IncomingMessage`,
  `DeliveryPolicy`, `SubscriptionHandle`, `TransportCapabilities`, `MessageBusConfig`.
- `StompMessageBus.ts` — STOMP adapter contract and `DeliveryPolicy` → STOMP header
  translation.
- `MqttMessageBus.ts` — MQTT adapter contract, MQTT 3.1.1/5.0 config, QoS ceiling, and
  capability declaration.

Design rules encoded in the port:

- Callers name a `destination` and a `DeliveryPolicy` in protocol-neutral terms. They
  never see STOMP header names, MQTT QoS values, or client ids.
- `IncomingMessage.ack()` / `.nack()` are always present. Auto-acknowledging transports
  implement them as no-ops, so call sites stay uniform across adapters.
- Capabilities are declared as literal types per adapter, so unsupported features (QoS 2,
  shared subscriptions) are visible at compile time rather than discovered at runtime.

## Related

- `docs/streamelements-overlay-conversion.md`
- RabbitMQ Web MQTT plugin: https://www.rabbitmq.com/docs/web-mqtt
- RabbitMQ MQTT plugin (QoS/sessions/topics): https://www.rabbitmq.com/docs/mqtt
- MQTT.js browser usage: https://github.com/mqttjs/MQTT.js#browser
- `AGENTS.md` (project conventions; no local `.opencode/context/` exists)
