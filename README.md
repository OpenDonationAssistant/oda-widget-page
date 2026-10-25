[![DeepWiki](https://img.shields.io/badge/DeepWiki-Link-blue)](https://deepwiki.com/OpenDonationAssistant/oda-widget-page)

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Diagram how the app works - [Excalidraw](https://excalidraw.com/#json=Qcaz87U1XQkz4WzkLYUJL,bN9liBaXo8CO9t6Re9IAxA)

## Realtime transport: STOMP heartbeats and timeouts

The app runs two STOMP-over-WebSocket clients against RabbitMQ web-stomp
(`REACT_APP_WS_ENDPOINT`, normally `wss://<host>/ws`):

| Client | Runs in | File |
|---|---|---|
| Widget pub/sub | browser page | `src/socket.ts` |
| Donation/channel event bus | logger SharedWorker | `src/bus/EventBus.ts` |

Both use the same policy:

```ts
reconnectDelay: 500,
maxReconnectDelay: 30000,
reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
heartbeatIncoming: 10000,
heartbeatOutgoing: 10000,
heartbeatStrategy: TickerStrategy.Worker,
```

`TickerStrategy.Worker` keeps outgoing PINGs running when a page is in a
background tab. See `TODO.md` for the known caveat when this strategy is used
inside the logger SharedWorker.

### How the heartbeat math works

STOMP 1.2 negotiates heartbeats in `CONNECT` (`heart-beat: 10000,10000` means
"send every 10 s, expect data every 10 s"):

- outgoing PING interval = `max(heartbeatOutgoing, serverIncoming)`;
- allowed incoming silence = `max(heartbeatIncoming, serverOutgoing) * heartbeatToleranceMultiplier`
  (`@stomp/stompjs` default `heartbeatToleranceMultiplier = 2`).

With both sides at 10 s, the client sends a PING every 10 s and force-closes +
reconnects after ~20 s without any server frame. Reconnect delay doubles from
0.5 s up to 30 s, so a too-aggressive timeout produces outage cycles of up to
~50 s.

RabbitMQ mirrors the values requested by the client; the current
`rabbitmq_stomp` schema has no separate heartbeat setting (see
`rabbit_stomp_processor.erl#ensure_heartbeats/1`). The broker also closes a
connection when it receives no client frame for the negotiated receive timeout
and logs:

```
STOMP detected missed client heartbeat(s) ... closing it
```

So every hop must pass heartbeats and must tolerate at least 20 s of idleness
(preferably much longer).

### RabbitMQ (web-stomp) requirements

Snippet for `rabbitmq.conf` (keys from the `rabbitmq_web_stomp` schema):

```ini
# WebSocket listener (default 15674)
web_stomp.tcp.port = 15674

# Must match the path the client connects to; default is /ws
web_stomp.ws_path = /ws

# Cowboy WebSocket idle timeout, milliseconds.
# Must be comfortably above 2 x heartbeat (20 s); keep the Cowboy default 60 s.
web_stomp.ws_opts.idle_timeout = 60000

# HTTP keep-alive idle timeout, milliseconds - not the WebSocket timeout.
web_stomp.cowboy_opts.idle_timeout = 60000

# permessage-deflate, enabled by default. Heartbeats are single-byte frames,
# so this is safe unless a proxy mishandles compressed WebSocket frames.
web_stomp.ws_opts.compress = true
```

Do **not** add a `stomp.heartbeat` key: RabbitMQ uses the client's `CONNECT`
values and echoes them in `CONNECTED`. If the broker or an intermediary
advertises `heart-beat: 0,0`, stompjs disables incoming monitoring
automatically - the connection stays up, but silently dead sockets are no
longer detected.

Verify after a deploy:

```bash
rabbitmqctl list_connections protocol timeout
# protocol=stomp, timeout=10   (seconds)
```

### Traefik requirements

The `/ws` router must forward the WebSocket upgrade untouched and must not time
out before the heartbeats do.

```yaml
# EntryPoint serving the app (static config)
entryPoints:
  websecure:
    address: ":443"
    transport:
      respondingTimeouts:
        readTimeout: "60s"   # default; must stay above the heartbeat interval
        writeTimeout: "0s"   # default: no timeout
        idleTimeout: "180s"  # default; keep > heartbeat interval
```

```yaml
# Router for RabbitMQ web-stomp (dynamic config, illustration)
http:
  routers:
    rabbitmq-ws:
      rule: "PathPrefix(`/ws`)"
      entryPoints: [websecure]
      service: rabbitmq-web-stomp
      # no StripPrefix: web_stomp.ws_path must match, i.e. /ws
  services:
    rabbitmq-web-stomp:
      loadBalancer:
        servers:
          - url: "http://rabbitmq:15674"
        # default ServersTransport: dialTimeout=30s, idleConnTimeout=90s
```

Checklist:

- Do **not** attach `stripPrefix`, `buffering`, or compression middlewares to
  the `/ws` router; the upgrade request and the byte stream must pass through.
- `forwardingTimeouts.idleConnTimeout` (ServersTransport, default `90s`)
  applies to idle pooled backend connections; 10 s heartbeats keep the stream
  active, so the default is fine. Raise it if heartbeats are ever increased
  above 90 s.
- `transport.respondingTimeouts.readTimeout` (EntryPoint, default `60s`) must
  stay above the heartbeat interval. If a custom value below 20 s is set for
  the entrypoint, raise it or move `/ws` to a dedicated entrypoint with
  `readTimeout: "0s"`.
- Keep RabbitMQ web-stomp on a single backend replica (or enable sticky
  routing). STOMP durable subscriptions and their queues are node-local.
- `REACT_APP_WS_ENDPOINT`, `web_stomp.ws_path`, and the Traefik rule must agree
  on the `/ws` path - do not rewrite it.

Cluster manifests live in `oda-k3s-specs` (`route/`, `traefik-middleware.yaml`,
and the RabbitMQ deployment/configmap). Re-check them against this list whenever
the transport policy changes.

### Verification

1. DevTools -> Network -> WS -> Messages: one PING (`\n`) every ~10 s in each direction.
2. `rabbitmqctl list_connections protocol timeout` reports `10`.
3. Leave an OBS overlay open for 15+ minutes: no `websocket closed ... reconnecting`
   entries and no reconnect backoff.
4. RabbitMQ logs contain no `missed client heartbeat(s)` warnings.
5. When changing `heartbeatIncoming`/`heartbeatOutgoing`, update
   `src/socket.ts` **and** `src/bus/EventBus.ts` together, then re-check the
   Traefik and RabbitMQ values above.
