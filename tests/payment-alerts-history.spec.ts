/**
 * End-to-end check of the payment alerts widget:
 *
 *   login -> create "Оповещения/Алерты" widget -> add an alert triggered by
 *   system "ODA" -> open the widget in a second tab -> add a history donation
 *   with "show alert" -> assert the alert renders in the widget tab.
 *
 * Prerequisites for the local stack:
 *   - dev server on http://localhost:3001
 *   - `npm run build-worker` has been run, so public/logger-worker.js targets
 *     ws://localhost/ws (a worker built for production would subscribe to the
 *     production broker and never see local history events)
 *
 * Run with:
 *   npx playwright test tests/payment-alerts-history.spec.ts --project=chromium --reporter=line
 *
 * The spec uses `channel: "chrome"` (installed Google Chrome) because the
 * Playwright browser binaries are not provisioned in this repo. Install them
 * with `npx playwright install chromium` and drop that option if you prefer
 * bundled browsers.
 */
import { expect, test } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const BASE_URL = "http://localhost:3001";
const WIDGET_TITLE = "Оповещения/Алерты";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";

const debug = process.env.E2E_DEBUG === "1";

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

test("payment alerts widget renders a history donation alert", async ({
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

  // 2. Create the alerts widget through the add-widget wizard.
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
  const created = (await createResponse.json()) as { id: string };
  const widgetId = created.id;
  expect(widgetId, "created widget id").toBeTruthy();
  if (debug) console.log(`created widget ${widgetId}`);

  // 3. Make sure the widget settings modal is open on the alerts tab. It opens
  // automatically only when a preset was selected in the wizard.
  const alertsTab = page.getByRole("tab", { name: "Оповещения" });
  if (
    !(await alertsTab.isVisible({ timeout: 5_000 }).catch(() => false))
  ) {
    if (debug) console.log("widget settings modal not open, clicking row");
    await page
      .locator(".widget-title", { hasText: WIDGET_TITLE })
      .last()
      .click();
    await expect(alertsTab).toBeVisible({ timeout: 15_000 });
  }
  await alertsTab.click();

  // 4. Add an alert through the add-alert wizard.
  await page.getByRole("button", { name: "Добавить оповещение" }).click();
  await expect(
    page.getByText("Выберите шаблон", { exact: true }),
  ).toBeVisible({ timeout: 15_000 });
  await page.locator('[class*="previewcard"]').first().click();
  await page.getByRole("button", { name: "Далее" }).click();

  // 5. The fullscreen alert editor opens automatically for the new alert.
  const editor = page.locator('[class*="fullscreen"]').last();
  await expect(editor).toBeVisible({ timeout: 20_000 });
  const generalTab = editor.getByRole("tab", { name: "Общее" });
  await expect(generalTab).toBeVisible({ timeout: 20_000 });
  await generalTab.click();

  // Trigger: "Донат сделан через" -> "ODA".
  const triggerBlock = editor
    .locator("div.settings-item")
    .filter({ hasText: "Срабатывает когда" });
  await triggerBlock
    .getByRole("button", { name: "Добавить условие" })
    .click();

  const typeSelect = triggerBlock.locator(".ant-select").first();
  await expect(typeSelect).toContainText("никогда", { timeout: 10_000 });
  await typeSelect.click();
  await page
    .locator(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
    )
    .filter({ hasText: "Донат сделан через" })
    .first()
    .click();

  const systemSelect = triggerBlock.locator(".ant-select").last();
  await expect(systemSelect).toBeVisible({ timeout: 10_000 });
  await systemSelect.click();
  await page
    .locator(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
    )
    .filter({ hasText: /^ODA$/ })
    .first()
    .click();
  await expect(systemSelect).toContainText("ODA", { timeout: 10_000 });

  // 6. Save the widget config from the alert editor and close the editor.
  const patched = page.waitForResponse(
    (response) =>
      response.request().method() === "PATCH" &&
      new URL(response.url()).pathname === `/widgets/${widgetId}`,
    { timeout: 30_000 },
  );
  await editor.getByRole("button", { name: "Сохранить" }).click();
  const patchResponse = await patched;
  expect(
    patchResponse.ok(),
    `widget PATCH should succeed, got ${patchResponse.status()}`,
  ).toBeTruthy();
  await expect(editor.getByRole("button", { name: "Сохранить" })).toBeDisabled({
    timeout: 15_000,
  });

  await page.keyboard.press("Escape");
  await expect(editor).toBeHidden({ timeout: 10_000 });

  // 7. Open the alert widget in a second tab of the same context. It shares
  // localStorage and the logger SharedWorker with the first tab.
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
  await widgetPage.goto(`${BASE_URL}/payment-alerts/${widgetId}`, {
    waitUntil: "domcontentloaded",
  });
  await widgetSettingsLoaded;
  // Give the SharedWorker time to connect to STOMP and open its subscription.
  await widgetPage.waitForTimeout(3_000);

  // 8. Fire a donation with "show alert" enabled from the history page.
  const timestamp = Date.now();
  const nickname = `e2e-user-${timestamp}`;
  const message = `e2e-alert-${timestamp}`;

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
    .locator("input");
  await amountInput.fill("100");
  await amountInput.blur();

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

  // 9. The alert widget tab must render the alert.
  try {
    await expect(widgetPage.getByText(message, { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(widgetPage.getByText(nickname, { exact: false })).toBeVisible({
      timeout: 5_000,
    });
  } catch (error) {
    if (debug) {
      console.log("--- widget page console ---");
      console.log(widgetConsoleLogs.join("\n"));
      console.log("--- config page console (tail) ---");
      console.log(consoleLogs.slice(-80).join("\n"));
    }
    await widgetPage.screenshot({
      path: "test-results/payment-alerts-widget-failure.png",
      fullPage: true,
    });
    throw error;
  }

  // 10. Best-effort cleanup of the widget created by this test.
  try {
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("access-token"),
    );
    if (accessToken) {
      const response = await context.request.delete(
        `http://localhost/widgets/${widgetId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (debug) console.log(`cleanup DELETE /widgets/${widgetId}: ${response.status()}`);
    }
    await widgetPage.close();
  } catch (error) {
    if (debug) console.log(`cleanup failed: ${String(error)}`);
  }
});
