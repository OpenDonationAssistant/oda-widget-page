# TODO

## Transport hardening

### 1. Don't use `TickerStrategy.Worker` inside the logger SharedWorker

**Status:** open<br>
**Where:** `src/bus/EventBus.ts:170` (`heartbeatStrategy: TickerStrategy.Worker`)<br>
**Severity:** high — can silently stop all donation/channel events

#### Context

`DefaultEventBus` is constructed inside the logger SharedWorker
(`src/sw/logger-worker/logger-worker.ts:414`), not in the page. With
`TickerStrategy.Worker`, `@stomp/stompjs` sends outgoing heartbeat pings from a
**nested blob Worker** created inside that SharedWorker
(`node_modules/@stomp/stompjs/esm6/ticker.js:30-35`):

```js
this._worker = new Worker(
  URL.createObjectURL(new Blob([this._workerScript], { type: "text/javascript" })),
);
```

#### Failure mode

- `Ticker.start()` runs from `_setupHeartbeat()` **before** the user `onConnect`
  callback (`stomp-handler.js:36-37`).
- `new Worker(...)` is not guarded by stompjs. If nested workers are unavailable
  (older OBS/CEF, hardened/embedded browser, CSP `worker-src` without `blob:`),
  it throws.
- The exception aborts CONNECTED-frame handling, `onConnect` never runs, and the
  event bus never subscribes to `/topic/<recipientId>.events`
  (`src/bus/EventBus.ts` `onConnect`). Result: the widget connects but receives
  no events, with no visible error in the UI.

The current deployment serves no CSP (`httpd.conf`, `public/index.html`), so CSP
is not the trigger today; nested-worker support in the embedding browser is.

#### Proposed fix

Use `TickerStrategy.Interval` for the worker-resident client only:

```ts
// src/bus/EventBus.ts
heartbeatStrategy: TickerStrategy.Interval,
```

Keep `TickerStrategy.Worker` in `src/socket.ts` — that client runs in the page,
where the Worker ticker is needed to avoid background-tab timer throttling.
Inside a SharedWorker, `setInterval` is not throttled, so `Interval` is both
safe and sufficient.

Alternative (only if a Worker ticker is later proven necessary there): wrap
worker creation in a feature check with an `Interval` fallback. stompjs does not
expose a hook for this, so the simple option is preferred.

#### Acceptance criteria

- [ ] `EventBus` uses `TickerStrategy.Interval` (or a guarded fallback).
- [ ] OBS browser source left open 30+ min: PING frames every ~10 s, no
      `websocket closed` reconnect entries.
- [ ] With `Worker`/blob workers blocked in DevTools (or a stubbed
      `globalThis.Worker`), the bus still subscribes and events still arrive.
- [ ] A regression test covers event delivery when heartbeat ticker creation
      fails (mock/stub `Worker`).

#### References

- `src/bus/EventBus.ts:157-171` — client options
- `src/sw/logger-worker/logger-worker.ts:414` — worker-side construction
- `node_modules/@stomp/stompjs/esm6/ticker.js:30-35` — blob Worker creation
- `node_modules/@stomp/stompjs/esm6/stomp-handler.js:36-37` — heartbeat before `onConnect`

### 2. `EventBus.onEvent` is dead code and duplicates `src/utils.ts:17`

**Status:** open<br>
**Where:** `src/bus/EventBus.ts:147-152`, `:173`, `:299-318`, `:323`
**Severity:** low (dead API surface, maintenance risk)

#### Context

`DefaultEventBus` exposes a public subscription API that nobody uses:

- `EventListener` type and the `onEvent` member of the `EventBus` interface
  (`src/bus/EventBus.ts:147-152`);
- `_eventListeners` registry (`:173`);
- `onEvent` / `notifyEventListeners` (`:299-318`);
- `notifyEventListeners(event)` on every `push` (`:323`).

`grep -rn "onEvent" src` finds no consumer of this API, and the per-push loop
always iterates an empty `Set`.

Meanwhile, page-side code already has an event API with the same name:
`src/utils.ts:17` `export function onEvent(fn)` wraps `onWorkerMessage` and
reconstructs an `Event` from worker messages. It is the API actually used by
`src/pages/Alerts/AlertController.ts:66`, `src/pages/StreamCredits/StreamCreditsStore.ts:31`,
and `src/pages/ChatWidgetV2/ChatWidgetV2.tsx:89`.

Two same-named `onEvent` APIs with different execution contexts (SharedWorker
vs page) invite the wrong import and make the transport layer look larger than
it is.

#### Options

1. **Remove it (recommended):** delete `EventListener`, the interface member,
   `_eventListeners`, `onEvent`, `notifyEventListeners`, and the call in `push`.
   Worker handlers already publish via `eventbus.push`; page consumers already
   receive events through `src/utils.ts`.
2. **Wire it up:** if a worker-side in-process subscriber is genuinely needed
   (e.g. to avoid a `postMessage` round-trip), use it in at least one handler
   and document why it exists next to the page-side `onEvent`.

Whichever option is chosen, keep a single discoverable name/semantics for
"subscribe to events".

#### Acceptance criteria

- [ ] No unused `onEvent` API remains, or it has a real worker-side consumer with
      a comment explaining the distinction from `src/utils.ts:onEvent`.
- [ ] `push` does no listener bookkeeping when no listener API is exposed.
- [ ] If retained, a test covers listener isolation (throwing listener must not
      block persistence/broadcast) — the behavior `notifyEventListeners` was
      added for.
