/**
 * End-to-end check of the "События" widget:
 *
 *   login -> create a "События" widget -> open it in a second tab -> add a
 *   history donation with "show alert" -> assert the donation renders on the
 *   widget in real time.
 *
 * Prerequisites for the local stack:
 *   - dev server on http://localhost:3001
 *   - `npm run build-worker` has been run, so public/logger-worker.js targets
 *     ws://localhost/ws (a worker built for production would subscribe to the
 *     production broker and never see local history events)
 *   - the history/alert services and the STOMP broker are running locally
 *
 * Run with:
 *   npx playwright test tests/events-widget-history.spec.ts --project=chromium --reporter=line
 *
 * The spec uses `channel: "chrome"` (installed Google Chrome) because the
 * Playwright browser binaries are not provisioned in this repo. Install them
 * with `npx playwright install chromium` and drop that option if you prefer
 * bundled browsers.
 */
import { expect, test } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const BASE_URL = "http://localhost:3001";
const WIDGET_TITLE = "События";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";

const debug = process.env.E2E_DEBUG === "1";

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

test("События widget renders a history item added in another tab", async ({
  context,
  page,
}) => {
  const consoleLogs: string[] = [];
  page.on("console", (message) => {
    const line = `[console:${message.type()}] ${message.text()}`;
    consoleLogs.push(line);
    if (debug) console.log(line);
  });
  page.on("pageerror", (error) => {
    const line = `[pageerror] ${error.message}`;
    consoleLogs.push(line);
    if (debug) console.log(line);
  });

  await installKeycloakTokenProxy(context);
  await context.addInitScript(() => {
    try {
      localStorage.setItem("i18nextLng", "ru");
    } catch {
      // ignore
    }
  });

  // 1. Sign in through the real login form. Keycloak CORS is bypassed by the
  // context route installed above.
  await page.goto(`${BASE_URL}/configuration/widgets`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/login\?page=/);
  await page.locator(".login-container input").fill(LOGIN);
  await page.locator(".password-container input").fill(PASSWORD);
  await page.locator("#login").click();

  await expect(page).toHaveURL(/\/configuration\/widgets/, {
    timeout: 30_000,
  });
  await expect(page.locator("#widgetlistholder")).toBeVisible({
    timeout: 30_000,
  });

  // 2. Create the "События" widget through the add-widget wizard.
  const createdResponse = page.waitForResponse(
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
    if (debug) console.log("widget wizard: preset step appeared");
    await page.locator('[class*="previewcard"]').first().click();
    await page.getByRole("button", { name: "Далее" }).click();
  }

  const createResponse = await createdResponse;
  expect(createResponse.ok(), "widget creation should succeed").toBeTruthy();
  const created = (await createResponse.json()) as { id: string };
  const widgetId = created.id;
  expect(widgetId, "created widget id").toBeTruthy();
  if (debug) console.log(`created widget ${widgetId}`);

  // Let the wizard settle (it may still be applying a preset) before moving
  // to another page.
  await page.waitForTimeout(1_000);

  // 3. Open the widget in a second tab of the same context. It shares
  // localStorage and the auth session with the first tab.
  const widgetPage = await context.newPage();
  const widgetConsoleLogs: string[] = [];
  widgetPage.on("console", (message) => {
    const line = `[widget console:${message.type()}] ${message.text()}`;
    widgetConsoleLogs.push(line);
    if (debug) console.log(line);
  });

  const widgetSettingsLoaded = widgetPage.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === `/widgets/${widgetId}`,
    { timeout: 30_000 },
  );
  const initialHistoryLoaded = widgetPage.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === "/history",
    { timeout: 30_000 },
  );
  await widgetPage.goto(`${BASE_URL}/payments/${widgetId}`, {
    waitUntil: "domcontentloaded",
  });
  await widgetSettingsLoaded;
  await initialHistoryLoaded;
  // HistoryStore subscribes to the events topic only after the initial page
  // has loaded; give the STOMP connection a moment to be established.
  await widgetPage.waitForTimeout(3_000);

  // 4. Add a history item with "show alert" enabled. The alert pipeline is
  // what publishes the event on the history topic consumed by the widget.
  const timestamp = Date.now();
  const nickname = `e2e-user-${timestamp}`;
  const message = `e2e-event-${timestamp}`;

  await page.goto(`${BASE_URL}/configuration/history-page`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: "Добавить донат" }).click();
  await expect(
    page.getByText("Ник поддержавшего", { exact: true }),
  ).toBeVisible({ timeout: 30_000 });
  await page
    .getByText("Ник поддержавшего", { exact: true })
    .locator("..")
    .locator("input")
    .fill(nickname);

  const amountInput = page
    .getByText("Сумма", { exact: true })
    .locator("..")
    .locator('input[role="spinbutton"]');
  await amountInput.fill("100");
  await amountInput.blur();

  // AddHistoryItemModal renders the message with `<Input type="textarea">`,
  // which Ant Design turns into a regular `<input>` rather than a <textarea>.
  await page
    .getByText("Сообщение", { exact: true })
    .locator("..")
    .locator("input")
    .fill(message);

  const showAlertSwitch = page
    .getByText("Показать алерт", { exact: true })
    .locator("..")
    .getByRole("switch");
  await showAlertSwitch.click();
  await expect(showAlertSwitch).toHaveAttribute("aria-checked", "true");

  const historyItemPosted = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname.endsWith("/history/commands/add-item"),
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Добавить", exact: true }).click();
  const historyResponse = await historyItemPosted;
  expect(
    historyResponse.ok(),
    `history item POST should succeed, got ${historyResponse.status()}`,
  ).toBeTruthy();

  // 5. The widget tab must render the new history item in real time.
  try {
    await expect(widgetPage.getByText(message, { exact: true })).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      widgetPage.getByText(nickname, { exact: false }),
    ).toBeVisible({ timeout: 5_000 });
  } catch (error) {
    if (debug) {
      console.log("--- widget page console ---");
      console.log(widgetConsoleLogs.join("\n"));
      console.log("--- config page console (tail) ---");
      console.log(consoleLogs.slice(-80).join("\n"));
    }
    await widgetPage.screenshot({
      path: "test-results/events-widget-failure.png",
      fullPage: true,
    });
    throw error;
  }

  // 6. Best-effort cleanup of the widget created by this test.
  try {
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("access-token"),
    );
    if (accessToken) {
      const response = await context.request.delete(
        `http://localhost/widgets/${widgetId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (debug) {
        console.log(
          `cleanup DELETE /widgets/${widgetId}: ${response.status()}`,
        );
      }
    }
    await widgetPage.close();
  } catch (error) {
    if (debug) console.log(`cleanup failed: ${String(error)}`);
  }
});
