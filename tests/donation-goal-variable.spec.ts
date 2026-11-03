/**
 * End-to-end check of the automation variables -> donation goal integration:
 *
 *   1. add a number variable on the automation page and save it;
 *   2. create an automation rule: "Донат" trigger -> "Увеличить переменную"
 *      by 1, and save it;
 *   3. create a "Горизонтальная лента событий" (horizontal events) widget and
 *      open it in a third tab, before any donation exists;
 *   4. create a "Цели сбора" (donation goal) widget, switch its goal to the
 *      "Все донаты" collection mode (mode=ALL), give it a 100 RUB target and
 *      use the variable placeholder `<name>` as the goal title;
 *   5. open the goal widget in a second tab of the same context and assert
 *      the title renders the variable value instead of the placeholder;
 *   6. add a 100 RUB donation on the history page with "Показать алерт"
 *      enabled, because the events topic is fed by the alert pipeline;
 *   7. assert the goal widget receives the goal update over STOMP
 *      (100 / 100 RUB), that the automation rule bumped the title variable
 *      from 4242 to 4243, and that the events feed in the third tab shows the
 *      new donation.
 *
 * Prerequisites for the local stack:
 *   - dev server on http://localhost:3001
 *   - API gateway on http://localhost (the console talks to it directly)
 *   - a reachable local STOMP broker at ws://localhost/ws: both widgets react
 *     to realtime topics, so steps 6-7 need it. The goal title itself comes
 *     from the widget config and the automation API.
 *
 * Run with:
 *   npx playwright test tests/donation-goal-variable.spec.ts --project=chromium --reporter=line
 *
 * The spec uses `channel: "chrome"` (installed Google Chrome) because the
 * Playwright browser binaries are not provisioned in this repo.
 */
import { expect, test, type Page } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const BASE_URL = "http://localhost:3001";
const API_URL = "http://localhost";
const WS_URL = "ws://localhost/ws";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";
const WIDGET_TITLE = "Цели сбора";
const EVENTS_WIDGET_TITLE = "Горизонтальная лента событий";
const GOAL_MODE_ALL = "Все донаты";
const VARIABLE_VALUE = 4242;
const INCREMENTED_VARIABLE_VALUE = VARIABLE_VALUE + 1;
const DONATION_AMOUNT = 100;

const debug = process.env.E2E_DEBUG === "1";

/**
 * Tracks the page's STOMP connection: resolves once the client receives the
 * CONNECTED frame. Matching the URL exactly excludes the dev server HMR
 * socket on :3001.
 */
function watchStomp(page: Page, label: string) {
  const state = { connected: false };
  page.on("websocket", (webSocket) => {
    if (webSocket.url() !== WS_URL) {
      return;
    }
    webSocket.on("framereceived", (frame) => {
      const payload = String(frame.payload);
      if (debug) {
        console.log(`[${label} ws] ${JSON.stringify(payload.slice(0, 500))}`);
      }
      if (payload.startsWith("CONNECTED")) {
        state.connected = true;
      }
    });
  });
  return state;
}

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

test("donation goal and horizontal events update after an automation-driven donation", async ({
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

  async function createWidget(title: string): Promise<string> {
    const createdResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname.endsWith("/widgets/commands/add"),
      { timeout: 30_000 },
    );

    await page.getByRole("button", { name: "Добавить виджет" }).click();
    await page
      .locator('[class*="widgetpreviewtitle"]')
      .filter({ hasText: title })
      .first()
      .click();
    await page.getByRole("button", { name: "Далее" }).click();

    const templateStep = page.getByText("Выберите шаблон", { exact: true });
    if (await templateStep.isVisible({ timeout: 8_000 }).catch(() => false)) {
      if (debug) console.log(`widget wizard: preset step appeared for ${title}`);
      await page.locator('[class*="previewcard"]').first().click();
      await page.getByRole("button", { name: "Далее" }).click();
    }

    const response = await createdResponse;
    expect(
      response.ok(),
      `widget POST for ${title} should succeed, got ${response.status()}`,
    ).toBeTruthy();
    const created = (await response.json()) as { id: string };
    expect(created.id, `created widget id for ${title}`).toBeTruthy();
    if (debug) console.log(`created widget "${title}": ${created.id}`);
    return created.id;
  }

  const timestamp = Date.now();
  const variableName = `e2eVar${timestamp}`;
  const goalTitle = `<${variableName}>`;

  // 1. Sign in through the real login form. Keycloak CORS is bypassed by the
  // context route installed above.
  const automationLoaded = page.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === "/automation",
    { timeout: 90_000 },
  );
  await page.goto(`${BASE_URL}/configuration/automation-page`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/login\?page=/);
  await page.locator(".login-container input").fill(LOGIN);
  await page.locator(".password-container input").fill(PASSWORD);
  await page.locator("#login").click();

  await expect(page).toHaveURL(/\/configuration\/automation-page/, {
    timeout: 30_000,
  });
  await automationLoaded;
  await expect(page.getByRole("heading", { name: "Автоматизация" })).toBeVisible(
    { timeout: 30_000 },
  );

  // 2. Add a number variable. The "Числа" section is the first variable list
  // on the "Переменные" tab, so its add control is the first `.addvariable`.
  await page.getByRole("tab", { name: "Переменные" }).click();
  const addNumberButton = page.locator('[class*="addvariable"]').first();
  await expect(addNumberButton).toBeVisible({ timeout: 15_000 });
  await addNumberButton.click();

  const numberList = addNumberButton.locator("..");
  const variableRow = numberList
    .locator('[class*="variablecontainer"]')
    .last();
  await expect(variableRow).toBeVisible({ timeout: 15_000 });

  // Rename the freshly added variable. The pencil button is the first button
  // in the row; while editing, the check button takes the same position.
  await variableRow.locator("button").first().click();
  const nameInput = variableRow
    .locator('input:not([role="spinbutton"])')
    .first();
  await expect(nameInput).toBeVisible({ timeout: 10_000 });
  await nameInput.fill(variableName);
  await variableRow.locator("button").first().click();
  await expect(
    variableRow.getByText(variableName, { exact: true }),
  ).toBeVisible({ timeout: 10_000 });

  const valueInput = variableRow.locator('input[role="spinbutton"]');
  await valueInput.fill(String(VARIABLE_VALUE));
  await valueInput.press("Tab");
  await expect(valueInput).toHaveValue(String(VARIABLE_VALUE));

  const automationSaved = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname ===
        "/automation/commands/set-state",
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Сохранить" }).click();
  const automationResponse = await automationSaved;
  expect(
    automationResponse.ok(),
    `automation state POST should succeed, got ${automationResponse.status()}`,
  ).toBeTruthy();

  // 3. Reload to prove the variable was persisted, not just kept in MobX.
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Автоматизация" })).toBeVisible(
    { timeout: 30_000 },
  );
  await page.getByRole("tab", { name: "Переменные" }).click();
  await expect(page.getByText(variableName, { exact: true })).toBeVisible({
    timeout: 20_000,
  });

  // 4. Create an automation rule: a donation increases the variable by 1.
  // Saving the automation state below persists both the variable and the rule.
  await page.getByRole("tab", { name: "Правила" }).click();
  await page.getByRole("button", { name: "Добавить правило" }).click();

  // The new rule is appended to the list, so it is the last collapsible card.
  const ruleCard = page.locator('[class*="collapsible"]').last();
  await expect(ruleCard).toBeVisible({ timeout: 15_000 });
  await ruleCard.getByText("Без названия", { exact: true }).click();
  await expect(ruleCard.getByText("Условия", { exact: true })).toBeVisible({
    timeout: 10_000,
  });

  // Trigger: "Донат" (any platform, any amount).
  await ruleCard.getByRole("button", { name: "Добавить условие" }).click();
  const triggerModal = page.locator('[class*="bigmodal"]').last();
  await expect(triggerModal).toBeVisible({ timeout: 10_000 });
  await triggerModal.locator(".ant-select").first().click();
  await page
    .locator(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
    )
    .filter({ hasText: /^Донат$/ })
    .first()
    .click();
  await triggerModal.getByRole("button", { name: "Сохранить" }).click();
  await expect(ruleCard.getByText("Донат", { exact: true })).toBeVisible({
    timeout: 10_000,
  });

  // Action: "Увеличить переменную" on the variable created above (increment
  // stays at the default 1).
  await ruleCard.getByRole("button", { name: "Добавить действие" }).click();
  const actionModal = page.locator('[class*="bigmodal"]').last();
  await expect(actionModal).toBeVisible({ timeout: 10_000 });
  await actionModal.locator(".ant-select").first().click();
  await page
    .locator(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
    )
    .filter({ hasText: /^Увеличить переменную$/ })
    .first()
    .click();
  await actionModal.locator(".ant-select").nth(1).click();
  await page
    .locator(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
    )
    .filter({ hasText: variableName })
    .first()
    .click();
  await actionModal.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    ruleCard.getByText("Увеличить переменную", { exact: true }),
  ).toBeVisible({ timeout: 10_000 });

  const ruleSaved = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname ===
        "/automation/commands/set-state",
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Сохранить" }).click();
  const ruleResponse = await ruleSaved;
  expect(
    ruleResponse.ok(),
    `automation rule POST should succeed, got ${ruleResponse.status()}`,
  ).toBeTruthy();

  // 5. Create the horizontal events widget before the donation, then open it
  // in a third tab so its feed has to pick the new donation up in realtime.
  await page.goto(`${BASE_URL}/configuration/widgets`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("#widgetlistholder")).toBeVisible({
    timeout: 30_000,
  });

  const eventsWidgetId = await createWidget(EVENTS_WIDGET_TITLE);
  // The settings modal opens automatically only when the wizard applied a
  // preset; close it before adding the next widget.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const eventsPage = await context.newPage();
  const eventsConsoleLogs: string[] = [];
  eventsPage.on("console", (message) => {
    const line = `[events console:${message.type()}] ${message.text()}`;
    eventsConsoleLogs.push(line);
    if (debug) console.log(line);
  });

  // HistoryStore loads one history page first and only then subscribes to the
  // events topic, so wait for that response and for the STOMP connection. The
  // extra delay lets a queued widget reload command and the SUBSCRIBE frames
  // settle before the donation is published.
  const eventsStomp = watchStomp(eventsPage, "horizontal-events");
  const eventsHistoryLoaded = eventsPage.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === "/history",
    { timeout: 30_000 },
  );
  await eventsPage.goto(`${BASE_URL}/horizontal-events/${eventsWidgetId}`, {
    waitUntil: "domcontentloaded",
  });
  await eventsHistoryLoaded;
  await expect
    .poll(() => eventsStomp.connected, {
      timeout: 20_000,
      message: "events widget STOMP client did not connect in 20s",
    })
    .toBe(true);
  await eventsPage.waitForTimeout(3_000);

  // 6. Create the donation goal widget through the add-widget wizard.
  const widgetId = await createWidget(WIDGET_TITLE);

  // 7. Open the settings modal. It opens by itself only when the wizard
  // applied a preset, so fall back to clicking the widget row.
  const goalsTab = page.getByRole("tab", { name: "Цели" });
  if (!(await goalsTab.isVisible({ timeout: 10_000 }).catch(() => false))) {
    if (debug) console.log("widget settings modal not open, clicking row");
    await page
      .locator(".widget-title", { hasText: WIDGET_TITLE })
      .last()
      .click();
  }
  await expect(goalsTab).toBeVisible({ timeout: 20_000 });
  await goalsTab.click();

  // 8. Expand the (single) goal and configure it: mode=ALL plus a title that
  // references the automation variable.
  const goalListItem = page.locator('[class*="goaltitle"]').first();
  await expect(goalListItem).toBeVisible({ timeout: 15_000 });
  await goalListItem.click();

  const goalEditor = page.locator('[class*="goalcontainer"]').first();
  await expect(goalEditor).toBeVisible({ timeout: 15_000 });

  await goalEditor
    .locator(".ant-segmented-item")
    .filter({ hasText: GOAL_MODE_ALL })
    .click();
  await expect(
    goalEditor.locator(".ant-segmented-item-selected"),
  ).toContainText(GOAL_MODE_ALL);

  // Textareas come in order: goal title, then goal description.
  const goalTitleArea = goalEditor.locator("textarea").first();
  await goalTitleArea.fill(goalTitle);
  await expect(goalTitleArea).toHaveValue(goalTitle);

  // Pin the goal target, so step 5 can assert an exact "100 / 100 RUB".
  const requiredAmountInput = goalEditor
    .getByText("Сумма", { exact: true })
    .locator("..")
    .locator('input[role="spinbutton"]');
  await requiredAmountInput.fill(String(DONATION_AMOUNT));
  await requiredAmountInput.press("Tab");
  await expect(requiredAmountInput).toHaveValue(String(DONATION_AMOUNT));

  const patched = page.waitForResponse(
    (response) =>
      response.request().method() === "PATCH" &&
      new URL(response.url()).pathname === `/widgets/${widgetId}`,
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Сохранить" }).click();
  const patchResponse = await patched;
  expect(
    patchResponse.ok(),
    `widget PATCH should succeed, got ${patchResponse.status()}`,
  ).toBeTruthy();
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeDisabled({
    timeout: 15_000,
  });

  const accessToken = await page.evaluate(() =>
    localStorage.getItem("access-token"),
  );

  // 9. Verify the saved config directly: mode=ALL and the variable template.
  expect(accessToken, "access token in localStorage").toBeTruthy();
  const storedWidget = await context.request.get(
    `${API_URL}/widgets/${widgetId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  expect(
    storedWidget.ok(),
    `stored widget GET should succeed, got ${storedWidget.status()}`,
  ).toBeTruthy();
  const storedJson = (await storedWidget.json()) as {
    config?: { properties?: { name: string; value: any }[] };
  };
  const goalProperty = (storedJson.config?.properties ?? []).find(
    (property) => property.name === "goal",
  );
  expect(goalProperty, "goal property in stored widget config").toBeTruthy();
  expect(goalProperty?.value?.[0]?.mode).toBe("all");
  expect(goalProperty?.value?.[0]?.briefDescription).toBe(goalTitle);

  // 10. Open the widget in a second tab of the same context. It shares
  // localStorage with the config tab, so the same session is used.
  const widgetPage = await context.newPage();
  if (debug) {
    widgetPage.on("framenavigated", (frame) => {
      if (frame === widgetPage.mainFrame()) {
        console.log(`[widget navigated] ${frame.url()}`);
      }
    });
  }
  const widgetConsoleLogs: string[] = [];
  widgetPage.on("console", (message) => {
    const line = `[widget console:${message.type()}] ${message.text()}`;
    widgetConsoleLogs.push(line);
    if (debug) console.log(line);
  });

  // The widget updates its progress from the goal topic, so remember when the
  // page's STOMP client reports CONNECTED (see watchStomp).
  const widgetStomp = watchStomp(widgetPage, "donation-goal");

  const widgetSettingsLoaded = widgetPage.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === `/widgets/${widgetId}`,
    { timeout: 30_000 },
  );
  const variablesLoaded = widgetPage.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      new URL(response.url()).pathname === "/automation/variables",
    { timeout: 30_000 },
  );
  await widgetPage.goto(`${BASE_URL}/donationgoal/${widgetId}`, {
    waitUntil: "domcontentloaded",
  });
  await widgetSettingsLoaded;
  await variablesLoaded;
  await expect
    .poll(() => widgetStomp.connected, {
      timeout: 20_000,
      message: "widget STOMP client did not connect to the local broker in 20s",
    })
    .toBe(true);
  // Let the SUBSCRIBE frames reach the broker before publishing a donation.
  await widgetPage.waitForTimeout(1_000);

  // 11. The goal title must render the variable value, not the placeholder.
  try {
    await expect(
      widgetPage.getByText(String(VARIABLE_VALUE), { exact: true }),
    ).toBeVisible({ timeout: 30_000 });
  } catch (error) {
    if (debug) {
      console.log("--- widget page console ---");
      console.log(widgetConsoleLogs.join("\n"));
      console.log("--- config page console (tail) ---");
      console.log(consoleLogs.slice(-80).join("\n"));
    }
    await widgetPage.screenshot({
      path: "test-results/donation-goal-variable-failure.png",
      fullPage: true,
    });
    throw error;
  }

  // 12. The freshly created goal starts at zero progress.
  const emptyProgress = widgetPage.getByText(
    `0 / ${DONATION_AMOUNT} RUB`,
    { exact: true },
  );
  await expect(emptyProgress).toBeVisible({ timeout: 20_000 });

  // 13. Fire a donation from the history page. The goal uses mode=ALL, so it
  // must be credited without explicitly selecting a goal in the donation
  // dialog.
  const donationTimestamp = Date.now();
  const donorNickname = `e2e-user-${donationTimestamp}`;

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
    .fill(donorNickname);

  const donationAmountInput = page
    .getByText("Сумма", { exact: true })
    .locator("..")
    .locator('input[role="spinbutton"]');
  await donationAmountInput.fill(String(DONATION_AMOUNT));
  await donationAmountInput.press("Tab");

  // The events topic is fed by the alert pipeline, so the donation has to
  // trigger an alert for the horizontal feed to receive it as a live event.
  const showAlertSwitch = page
    .getByText("Показать алерт", { exact: true })
    .locator("..")
    .getByRole("switch");
  await showAlertSwitch.click();
  await expect(showAlertSwitch).toHaveAttribute("aria-checked", "true");

  const historyItemPosted = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname.endsWith(
        "/history/commands/add-item",
      ),
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Добавить", exact: true }).click();
  const historyResponse = await historyItemPosted;
  expect(
    historyResponse.ok(),
    `history item POST should succeed, got ${historyResponse.status()}`,
  ).toBeTruthy();

  // 14. The widget tab must receive the goal update over STOMP and re-render
  // the progress label; the automation rule must also bump the title variable.
  try {
    await expect(
      widgetPage.getByText(
        `${DONATION_AMOUNT} / ${DONATION_AMOUNT} RUB`,
        { exact: true },
      ),
    ).toBeVisible({ timeout: 45_000 });

    // The rule increments the variable on the backend...
    await expect
      .poll(
        async () => {
          const response = await context.request.get(
            `${API_URL}/automation/variables`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          const json = (await response.json()) as {
            content?: { name: string; value: string }[];
          };
          return json.content?.find(
            (variable) => variable.name === variableName,
          )?.value;
        },
        { timeout: 30_000 },
      )
      .toBe(String(INCREMENTED_VARIABLE_VALUE));

    // ...and the goal title label must re-render with the new value. The
    // backend also sends the widget a reload command after a donation, so the
    // page re-mounts and re-reads the automation variables.
    await expect(
      widgetPage.getByText(String(INCREMENTED_VARIABLE_VALUE), {
        exact: true,
      }),
    ).toBeVisible({ timeout: 45_000 });
  } catch (error) {
    if (debug) {
      console.log("--- widget page console ---");
      console.log(widgetConsoleLogs.join("\n"));
      console.log("--- config page console (tail) ---");
      console.log(consoleLogs.slice(-80).join("\n"));
    }
    await widgetPage.screenshot({
      path: "test-results/donation-goal-progress-failure.png",
      fullPage: true,
    });
    throw error;
  }

  // 15. The horizontal events feed in the third tab must show the new
  // donation, without reloading that page.
  try {
    await expect(
      eventsPage.getByText(donorNickname, { exact: true }).first(),
    ).toBeVisible({ timeout: 45_000 });
  } catch (error) {
    if (debug) {
      console.log("--- events page console ---");
      console.log(eventsConsoleLogs.join("\n"));
    }
    await eventsPage.screenshot({
      path: "test-results/horizontal-events-failure.png",
      fullPage: true,
    });
    throw error;
  }

  // 16. Best-effort cleanup: remove both widgets, the rule and the variable
  // created by this test so repeated runs stay independent.
  try {
    if (accessToken) {
      for (const id of [widgetId, eventsWidgetId]) {
        const response = await context.request.delete(
          `${API_URL}/widgets/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (debug)
          console.log(`cleanup DELETE /widgets/${id}: ${response.status()}`);
      }
    }
    await widgetPage.close();
    await eventsPage.close();
  } catch (error) {
    if (debug) console.log(`widget cleanup failed: ${String(error)}`);
  }

  try {
    await page.goto(`${BASE_URL}/configuration/automation-page`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: "Автоматизация" }),
    ).toBeVisible({ timeout: 30_000 });

    // Wait for the automation state to load: the variable row only renders
    // once GET /automation resolved.
    await page.getByRole("tab", { name: "Переменные" }).click();
    const createdVariable = page
      .locator('[class*="variablecontainer"]')
      .filter({ hasText: variableName })
      .first();
    await expect(createdVariable).toBeVisible({ timeout: 20_000 });

    // Remove the automation rule created above. It is the last rule in the
    // list; expand it and check its action before deleting, so a failed run
    // does not remove an unrelated rule. Kept in its own try/catch so the
    // variable is still cleaned up when the rule was never created.
    try {
      await page.getByRole("tab", { name: "Правила" }).click();
      const lastRule = page.locator('[class*="collapsible"]').last();
      if (await lastRule.count()) {
        await lastRule
          .getByText("Без названия", { exact: true })
          .first()
          .click();
        const isOurRule = await expect(
          lastRule.getByText("Увеличить переменную", { exact: true }),
        )
          .toBeVisible({ timeout: 5_000 })
          .then(() => true)
          .catch(() => false);
        if (isOurRule) {
          await lastRule.getByText("Удалить", { exact: true }).click();
          // Every rule card renders the same confirm overlay, so pick the one
          // that belongs to the last rule we are deleting.
          await page.getByRole("button", { name: "Продолжить" }).last().click();
          if (debug) console.log("cleanup removed automation rule");
        }
      }
    } catch (error) {
      if (debug) console.log(`rule cleanup failed: ${String(error)}`);
    }

    await page.getByRole("tab", { name: "Переменные" }).click();
    await createdVariable.locator('[class*="deletevariable"]').click();

    const cleanupSaved = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname ===
          "/automation/commands/set-state",
      { timeout: 30_000 },
    );
    await page.getByRole("button", { name: "Сохранить" }).click();
    await cleanupSaved;
    if (debug) console.log(`cleanup removed variable ${variableName}`);
  } catch (error) {
    if (debug) console.log(`variable cleanup failed: ${String(error)}`);
  }
});
