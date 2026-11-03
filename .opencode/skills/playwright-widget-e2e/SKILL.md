---
name: playwright-widget-e2e
description: Add and run Playwright end-to-end tests for ODA widgets against the local stack. Use when writing a new widget e2e spec, adding coverage for a widget flow, or debugging existing Playwright tests in this repo.
disable-model-invocation: true
---

## Quick start

Copy the shape of `tests/media-widget-request.spec.ts`, then run:

```bash
npx playwright test tests/<name>.spec.ts --project=chromium --reporter=line --workers=1
```

## Why

These specs drive the real stack: console on `:3001`, API gateway, STOMP broker, and widget plus source pages in separate tabs. Reliable tests wait on network responses, STOMP frames, and backend polling instead of sleeps, and they clean up every widget they create.

## Workflow

1. Find the widget contract: type and default properties in `src/types/Widget.tsx`, route in `src/index.tsx`, settings panel in `src/components/ConfigurationPage/widgetsettings/`.
2. Check the stack: console `http://localhost:3001`, donation page `http://localhost:3000`, API gateway `http://localhost`, broker `ws://localhost/ws`. Rebuild the logger worker with `npm run build-worker` when local realtime behavior looks stale.
3. Scaffold `tests/<widget-flow>.spec.ts` using the template in [REFERENCE.md](REFERENCE.md). Add `test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } })` and `test.setTimeout(240_000)`.
4. Log in: call `installKeycloakTokenProxy(context)` from `tests/support/keycloak.ts`, open `/configuration/widgets`, fill the real form with `testuser` / `testuserpassword`.
5. Create the widget: click "Добавить виджет", pick the title, click "Далее", handle the "Выберите шаблон" step only when it appears. Capture the widget id from the `POST */widgets/commands/add` response.
6. Configure it: the settings modal opens only when a preset was applied; otherwise click the `.widget-title` row, then the needed tab. "Сохранить" stays disabled until a property changes. When the target equals the default, set a temporary value, save, then set the target and save again. Verify persisted values with `GET /widgets/{id}`.
7. Open the widget route in a second tab. Wait for `GET /widgets/{id}`, the widget data requests, and a STOMP `CONNECTED` frame on `ws://localhost/ws`, then wait about 2s for SUBSCRIBE frames.
8. Open the source page (donation page, history page, automation page) in a third tab, produce the event, and assert the widget UI. Prefer role and text locators; CSS module classes are hashed, so use `[class*="..."]` when needed.
9. Assert server state with `context.request` and the `access-token` from localStorage when UI alone is not enough. Use `expect.poll` for asynchronous config propagation.
10. Clean up in `finally`: delete the widget and mark generated media handled. Run the spec twice to prove idempotency.

## Anti-patterns

WRONG: assert immediately after a click, or replace waits with a fixed sleep.

RIGHT: `waitForResponse` for the write, `expect.poll` for backend propagation, and a STOMP `CONNECTED` gate before publishing the event.

WRONG: leave created widgets and media behind, or reuse fixed donation nicknames.

RIGHT: unique data per run (`e2e-user-${Date.now()}`) and a `finally` cleanup block.

## Checklist

- Spec lives in `tests/` and imports the Keycloak proxy.
- Every async step has a response, STOMP, or poll wait.
- Persisted config is verified when the next step depends on it.
- Cleanup runs even on failure, and a second run passes.
- Scoped typecheck passes: `npx tsc --noEmit --target es2021 --module commonjs --moduleResolution node --esModuleInterop --strict --skipLibCheck tests/<name>.spec.ts`.
- Command uses `--project=chromium`.

## See also

- [REFERENCE.md](REFERENCE.md): spec template, selectors, endpoints, cleanup.
- [EXAMPLES.md](EXAMPLES.md): worked widget specs in this repo.
- Existing specs: `tests/media-widget-request.spec.ts`, `tests/payment-alerts-history.spec.ts`, `tests/donation-goal-variable.spec.ts`.
