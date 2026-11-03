# Playwright widget e2e reference

Dense facts and reusable snippets for `tests/*.spec.ts` in oda-widget-page.

## Environment

| Item | Value |
| --- | --- |
| Console | `http://localhost:3001` (`.env.development` sets `PORT=3001`) |
| Donation page | `http://localhost:3000` (separate `oda-payment-page` app) |
| API gateway | `http://localhost` |
| STOMP broker | `ws://localhost/ws` |
| Login | `testuser` / `testuserpassword` |
| Test dir | `./tests` (`playwright.config.ts`) |
| Browser | Google Chrome via `test.use({ channel: "chrome" })`; bundled binaries are not provisioned |
| CI | The GitHub workflow runs no tests; specs are local-only |

API endpoints used by the specs resolve from `http://localhost` through `REACT_APP_*_API_ENDPOINT` in `.env.development`. The worker bundle must be built with `npm run build-worker` so the local page subscribes to `ws://localhost/ws`.

## Spec template

```ts
import { expect, test, type Page } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const BASE_URL = "http://localhost:3001";
const API_URL = "http://localhost";
const WS_URL = "ws://localhost/ws";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

test("widget flow", async ({ context, page }) => {
  await installKeycloakTokenProxy(context);
  await context.addInitScript(() => {
    try {
      localStorage.setItem("i18nextLng", "ru");
    } catch {}
  });

  await page.goto(`${BASE_URL}/configuration/widgets`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/login\?page=/);
  await page.locator(".login-container input").fill(LOGIN);
  await page.locator(".password-container input").fill(PASSWORD);
  await page.locator("#login").click();
  await expect(page.locator("#widgetlistholder")).toBeVisible({ timeout: 30_000 });

  const accessToken = await page.evaluate(() => localStorage.getItem("access-token"));
  const headers = { Authorization: `Bearer ${accessToken}` };
  // ... flow ...
});
```

## Login and auth

`installKeycloakTokenProxy` routes `**/realms/ODA/protocol/openid-connect/token` through the Playwright request context. Keycloak omits CORS headers for the console origin, so the browser cannot read the token response directly. Keep the route registered for the whole context because the app refreshes the token on page load.

`localStorage` keys: `access-token`, `refresh-token`, `{widgetId}-access-token`. The app token is not the Keycloak token; always read it from the page after login.

## Create a widget

```ts
const created = page.waitForResponse(
  (response) =>
    response.request().method() === "POST" &&
    new URL(response.url()).pathname.endsWith("/widgets/commands/add"),
  { timeout: 30_000 },
);

await page.getByRole("button", { name: "Добавить виджет" }).click();
await page
  .locator('[class*="widgetpreviewtitle"]')
  .filter({ hasText: WIDGET_TITLE })
  .first()
  .click();
await page.getByRole("button", { name: "Далее" }).click();

const templateStep = page.getByText("Выберите шаблон", { exact: true });
if (await templateStep.isVisible({ timeout: 8_000 }).catch(() => false)) {
  await page.locator('[class*="previewcard"]').first().click();
  await page.getByRole("button", { name: "Далее" }).click();
}

const response = await created;
const widget = await response.json(); // { id, ownerId, type, name, config }
```

The settings modal opens automatically only when the wizard applied a preset. Otherwise click the widget row:

```ts
await page.locator(".widget-title", { hasText: WIDGET_TITLE }).last().click();
await expect(page.getByRole("tab", { name: "Общие" })).toBeVisible();
```

## Save widget settings

The save button is disabled while `widget.config.unsaved` is false. If the value you need already equals the default, make the form dirty first:

```ts
const saveButton = page.getByRole("button", { name: "Сохранить" });
const input = page
  .locator(".settings-item")
  .filter({ hasText: "Стоимость видео" })
  .first()
  .locator('input[role="spinbutton"]')
  .first();

const initial = Number(await input.inputValue());
await input.fill(String(initial + 1));
await input.press("Tab");
await expect(saveButton).toBeEnabled();

const patched = page.waitForResponse(
  (response) =>
    response.request().method() === "PATCH" &&
    new URL(response.url()).pathname === `/widgets/${widgetId}`,
);
await saveButton.click();
expect((await patched).ok()).toBeTruthy();
await expect(saveButton).toBeDisabled();

await input.fill(String(target));
await input.press("Tab");
await expect(saveButton).toBeEnabled();
// save and await the second PATCH the same way
```

Payload shape: `PATCH /widgets/{id}` with `{ name, config: { properties: [{ name, value }] } }`.

## STOMP gate

```ts
function watchStomp(page: Page) {
  const state = { connected: false };
  page.on("websocket", (webSocket) => {
    if (webSocket.url() !== WS_URL) return;
    webSocket.on("framereceived", (frame) => {
      if (String(frame.payload).startsWith("CONNECTED")) state.connected = true;
    });
  });
  return state;
}

const stomp = watchStomp(widgetPage);
await widgetPage.goto(`${BASE_URL}/media/${widgetId}`, {
  waitUntil: "domcontentloaded",
});
await expect.poll(() => stomp.connected, { timeout: 20_000 }).toBe(true);
await widgetPage.waitForTimeout(2_000); // SUBSCRIBE frames reach the broker
```

Wait for topic data before asserting: widget pages usually issue `GET /widgets/{id}` and one or more data requests (`/media/video`, `/history`, `/automation/variables`).

## Locators and UI notes

- CSS module classes are hashed (`Media_module__mediatitle-abc`). Use `[class*="mediatitle"]`, not `.mediatitle`.
- Plain global classes exist too: `.widget-title`, `.settings-item`, `#widgetlistholder`, `#playlist`, `.song-title`.
- Ant Design widgets: `.ant-select` plus `.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option`.
- Icon buttons often have no accessible name; fall back to position or `[class*="..."]`.
- The donation page URL input is matched by placeholder `Название, ссылка Youtube или VKVideo`; nickname by `Аноним`; the amount is the first `input` in the form.
- Donation page section tabs: `Заказ музыки` (media), `Сбор средств` (goals), `Действия` (actions). They render only when the payment-page config enables the feature.

## Async config propagation

Some widget settings are mirrored into other services through events. Poll the read API before opening the dependent page:

```ts
await expect
  .poll(async () => {
    const response = await context.request.get(
      `${API_URL}/config/paymentpage?ownerId=${ownerId}`,
    );
    const json = await response.json();
    return {
      enabled: json.value?.["media.requests.enabled"],
      disabled: json.value?.["media.requests.disabled.permanently"],
      cost: json.value?.["media.requests.cost"],
    };
  }, { timeout: 30_000, intervals: [500, 1_000, 2_000] })
  .toEqual({ enabled: true, disabled: false, cost: 100 });
```

## Endpoints used by widget specs

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/widgets/commands/add` | Create widget, returns `id` and `ownerId` |
| GET | `/widgets/{id}` | Read stored widget config |
| PATCH | `/widgets/{id}` | Save `{ name, config.properties }` |
| DELETE | `/widgets/{id}` | Cleanup |
| GET | `/config/paymentpage?ownerId={id}` | Donation page config (media requests, goals) |
| GET | `/config/widgets?ownerId={id}` | STOMP topic names (`topic.player`, `topic.media`, ...), auth |
| GET | `/media/video` | Ready media for the recipient, auth |
| PUT | `/media/video` | Add a media request `{ url, recipientId }` |
| PATCH | `/media/video/{id}` | Mark media handled (removes it from ready lists) |
| GET | `/payments/gateways?recipientId={id}` | Enabled gateways; local stack uses `fake` |
| PUT | `/payments/commands/create` | Create payment draft; fake gateway completes it |
| PUT | `/payments/commands/complete` | Completion endpoint (fake gateway auto-completes) |
| GET | `/history` | History items (auth) |
| POST | `/history/commands/add-item` | Add synthetic donation |
| GET | `/automation` | Automation state (auth) |
| GET | `/automation/variables` | Variables (auth) |
| POST | `/automation/commands/set-state` | Save automation state |

## Cleanup and idempotency

```ts
try {
  // ... assertions ...
} finally {
  await context.request.delete(`${API_URL}/widgets/${widgetId}`, { headers });
  await context.request.patch(`${API_URL}/media/video/${mediaId}`);
}
```

Fixed media URLs are deduplicated by `originId` in the player playlist. Before opening the player, fetch ready media and mark same-origin leftovers handled, otherwise a new paid request is skipped as a duplicate.

## Run and debug

```bash
# one spec, one browser, readable output
npx playwright test tests/<name>.spec.ts --project=chromium --reporter=line --workers=1

# park console and network logs in the spec behind E2E_DEBUG
E2E_DEBUG=1 npx playwright test tests/<name>.spec.ts --project=chromium --reporter=line

# list discovery
npx playwright test --list

# record a trace
npx playwright test tests/<name>.spec.ts --project=chromium --trace=on
```

Screenshots and `.last-run.json` land in `test-results/` (gitignored). The HTML report lands in `playwright-report/`.

Do not run all three projects in parallel: the spec forces the Chrome channel in every project and all projects share the same `testuser` account.

## Where to look in the app

| Task | File |
| --- | --- |
| Widget type names, titles, default settings class | `src/types/Widget.tsx` |
| Routes for every widget | `src/index.tsx` |
| Widget settings panel and property editors | `src/components/ConfigurationPage/widgetsettings/`, `widgetproperties/` |
| Settings modal and Save button | `src/components/ConfigurationPage/WidgetConfiguration.tsx` |
| Store and save payload | `src/types/Widget.tsx` (`Widget.save`) |
| STOMP client | `src/socket.ts`, `src/config.ts` |
| Worker rebuild | `scripts/build-worker.mjs` |
