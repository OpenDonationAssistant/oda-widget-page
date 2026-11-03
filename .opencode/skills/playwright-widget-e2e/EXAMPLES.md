# Worked widget e2e examples

The specs below live in `tests/` and pass against the local stack. Use them as templates, not as text to copy verbatim.

## Media player request: `tests/media-widget-request.spec.ts`

Full flow: login, create "Медиаплеер", set the request cost to 100 RUB, open the player in a second tab, open the donation page on `:3000` in a third tab, request a VKVideo media, pay through the fake gateway, assert the playlist.

Key points:

- The settings default is already 100 RUB, so the spec sets 101, saves, then sets 100 and saves again. Both PATCHes are awaited and the stored `tarification` property is verified with `GET /widgets/{id}`.
- The payment page config is polled until `media.requests.enabled === true`, `media.requests.disabled.permanently === false`, and `media.requests.cost === 100`. Without this the donation page does not render "Заказ музыки".
- The player tab subscribes to `/topic/{recipient}media`. The test waits for STOMP `CONNECTED`, then 2s for the SUBSCRIBE frame, before paying.
- The media URL is added by filling the donation page input. The debounced handler calls `PUT /media/video` and returns `{ id, originId, title, cost }`; the assertion uses that title and the unique donor nickname.
- Before opening the player, same-origin ready media is marked handled with `PATCH /media/video/{id}`. The playlist skips duplicate `originId` values, so leftovers would hide the new request.
- The final assertion:

```ts
const requestedItem = widgetPage
  .locator("#playlist li.list-group-item")
  .filter({ hasText: nickname })
  .filter({ hasText: media.title })
  .first();
await expect(requestedItem).toBeVisible({ timeout: 45_000 });
await expect(requestedItem).toContainText(`Заказал: ${nickname}`);
```

- Cleanup marks the new media handled and deletes the widget in `finally`.

Run:

```bash
npx playwright test tests/media-widget-request.spec.ts --project=chromium --reporter=line --workers=1
```

## Payment alerts: `tests/payment-alerts-history.spec.ts`

Full flow: login, create "Оповещения/Алерты", add an alert triggered by the ODA system, open the widget in a second tab, add a history donation with "Показать алерт", assert the alert text renders in the widget.

What it demonstrates:

- The add-alert wizard with "Выберите шаблон" and the fullscreen alert editor.
- Ant Design select interaction for the trigger type and system.
- `POST /history/commands/add-item` as a synthetic event source.
- Capturing console logs and taking a failure screenshot before rethrowing.

## Donation goal and automation variable: `tests/donation-goal-variable.spec.ts`

Full flow: create a number variable, create an automation rule that increments it on a donation, create a horizontal events widget and open it in a third tab, create a donation goal widget bound to `mode=all` and the variable placeholder, open it in a second tab, donate 100 RUB with "Показать алерт", assert the goal update, the variable increment, and the event feed.

What it demonstrates:

- Cancelling and rescheduling work with `expect.poll` for backend state.
- Reading the access token and calling authenticated APIs with `context.request`.
- Direct config verification after a UI save (`goal.mode`, `briefDescription`).
- Cleanup of widgets, rules, and variables, including guarded cleanup that does not delete unrelated data.

## Choosing an example

| Scenario | Start from |
| --- | --- |
| Widget renders realtime events | `tests/payment-alerts-history.spec.ts` |
| Widget config depends on another backend resource | `tests/donation-goal-variable.spec.ts` |
| Widget consumes a second app (donation page) and a payment | `tests/media-widget-request.spec.ts` |
| Need STOMP connection gating | `tests/media-widget-request.spec.ts`, `tests/donation-goal-variable.spec.ts` |
| Need API polling after async config propagation | `tests/media-widget-request.spec.ts` |
