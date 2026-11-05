/**
 * End-to-end check of a donation goal in "default" mode:
 *
 *   1. login through the real login form;
 *   2. create a "Цели сбора" (donation goal) widget and configure its only
 *      goal with mode "По умолчанию" ("default"), a unique title and a
 *      100 RUB target;
 *   3. verify the saved widget config directly (`goal[0].mode === "default"`);
 *   4. wait until the donation goal service mirrors the goal into the public
 *      payment page config (`GET /config/paymentpage`) with `isDefault: true`;
 *   5. open the payment page on http://localhost:3000 and assert the "Сбор
 *      средств" tab renders the goal and marks it selected by default;
 *   6. donate 100 RUB through the fake gateway and assert the create-payment
 *      request carries our goal id (i.e. the default selection is used);
 *   7. wait until the history API returns the new donation with the goal
 *      title attached, then open the history page on http://localhost:3001 and
 *      assert the row shows the donation and the goal label;
 *   8. delete the widget in `finally` so repeated runs stay independent.
 *
 * Prerequisites for the local stack:
 *   - console dev server on http://localhost:3001 (PORT=3001)
 *   - payment page dev server on http://localhost:3000 (oda-payment-page)
 *   - API gateway on http://localhost with the "fake" fiat gateway enabled
 *   - RabbitMQ + the history, donationgoal, automation and payment services,
 *     because the goal is written into the payment page config through events
 *     and the goal title is attached to the history item asynchronously
 *
 * Run with:
 *   npx playwright test tests/donation-goal-default-payment.spec.ts \
 *     --project=chromium --reporter=line --workers=1
 *
 * The spec uses `channel: "chrome"` (installed Google Chrome) because the
 * Playwright browser binaries are not provisioned in this repo.
 */
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const CONSOLE_URL = "http://localhost:3001";
const PAYMENT_PAGE_URL = "http://localhost:3000";
const API_URL = "http://localhost";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";
const WIDGET_TITLE = "Цели сбора";
const GOAL_MODE_DEFAULT = "По умолчанию";
const DONATION_AMOUNT = 100;
const HISTORY_PAGE_PATH = "/configuration/history-page";

const debug = process.env.E2E_DEBUG === "1";

interface GoalConfig {
  id: string;
  briefDescription: string;
  mode?: string;
  requiredAmount?: { major: number; currency: string };
}

interface PaymentPageGoal {
  id: string;
  briefDescription?: string;
  enabled?: boolean;
  isDefault?: boolean;
}

interface HistoryGoal {
  goalId?: string;
  goalTitle?: string;
}

interface HistoryItem {
  id: string;
  nickname?: string;
  goals?: HistoryGoal[];
}

async function getPaymentPageGoals(
  request: APIRequestContext,
  ownerId: string,
): Promise<PaymentPageGoal[]> {
  const response = await request.get(
    `${API_URL}/config/paymentpage?ownerId=${ownerId}`,
  );
  expect(
    response.ok(),
    `GET /config/paymentpage?ownerId=${ownerId} returned ${response.status()}`,
  ).toBeTruthy();
  const json = (await response.json()) as {
    value?: { goals?: PaymentPageGoal[] };
  };
  return json.value?.goals ?? [];
}

async function getHistoryItems(
  request: APIRequestContext,
  token: string,
): Promise<HistoryItem[]> {
  const response = await request.get(
    `${API_URL}/history?page=0&size=10&sort=timestamp,desc`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  expect(
    response.ok(),
    `GET /history returned ${response.status()}`,
  ).toBeTruthy();
  const json = (await response.json()) as { content?: HistoryItem[] };
  return json.content ?? [];
}

/** Attach console/pageerror logs to a tab, optionally echoing them. */
function collectLogs(
  page: Page,
  label: string,
  logs: string[],
): void {
  page.on("console", (message) => {
    const line = `[${label} console:${message.type()}] ${message.text()}`;
    logs.push(line);
    if (debug) console.log(line);
  });
  page.on("pageerror", (error) => {
    const line = `[${label} pageerror] ${error.message}`;
    logs.push(line);
    if (debug) console.log(line);
  });
}

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(360_000);

test("a default donation goal is preselected on the payment page and labelled in history", async ({
  context,
  page,
}) => {
  const consoleLogs: string[] = [];
  collectLogs(page, "config", consoleLogs);

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
  await page.goto(`${CONSOLE_URL}/configuration/widgets`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/login\?page=/);
  await page.locator(".login-container input").fill(LOGIN);
  await page.locator(".password-container input").fill(PASSWORD);
  await page.locator("#login").click();
  await expect(page.locator("#widgetlistholder")).toBeVisible({
    timeout: 30_000,
  });

  const accessToken = await page.evaluate(() =>
    localStorage.getItem("access-token"),
  );
  expect(accessToken, "access token in localStorage").toBeTruthy();
  const authHeaders = { Authorization: `Bearer ${accessToken}` };
  const token = accessToken as string;

  const timestamp = Date.now();
  const goalTitle = `E2E Goal ${timestamp}`;

  let widgetId: string | undefined;
  let goalId: string | undefined;
  let ownerId = LOGIN;
  let paymentPage: Page | undefined;
  let historyPage: Page | undefined;

  try {
    // 2. Create the donation goal widget through the add-widget wizard.
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
    expect(
      createResponse.ok(),
      `widget POST should succeed, got ${createResponse.status()}`,
    ).toBeTruthy();
    const created = (await createResponse.json()) as {
      id: string;
      ownerId?: string;
    };
    widgetId = created.id;
    ownerId = created.ownerId ?? LOGIN;
    expect(widgetId, "created widget id").toBeTruthy();
    if (debug) console.log(`created donation goal widget ${widgetId}`);

    // 3. Open the settings modal. It opens by itself only when the wizard
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

    // Expand the single goal and switch it to the "default" mode.
    const goalListItem = page.locator('[class*="goaltitle"]').first();
    await expect(goalListItem).toBeVisible({ timeout: 15_000 });
    await goalListItem.click();

    const goalEditor = page.locator('[class*="goalcontainer"]').first();
    await expect(goalEditor).toBeVisible({ timeout: 15_000 });

    const modeSelector = goalEditor.locator(".ant-segmented").first();
    const selectedMode = modeSelector.locator(".ant-segmented-item-selected");
    const currentMode = (
      await selectedMode.innerText({ timeout: 5_000 }).catch(() => "")
    ).trim();
    if (currentMode !== GOAL_MODE_DEFAULT) {
      await modeSelector
        .locator(".ant-segmented-item")
        .filter({ hasText: GOAL_MODE_DEFAULT })
        .click();
    }
    await expect(selectedMode).toContainText(GOAL_MODE_DEFAULT);

    // Textareas come in order: goal title, then goal description.
    const goalTitleArea = goalEditor.locator("textarea").first();
    await goalTitleArea.fill(goalTitle);
    await expect(goalTitleArea).toHaveValue(goalTitle);

    const requiredAmountInput = goalEditor
      .getByText("Сумма", { exact: true })
      .locator("..")
      .locator('input[role="spinbutton"]');
    await requiredAmountInput.fill(String(DONATION_AMOUNT));
    await requiredAmountInput.press("Tab");
    await expect(requiredAmountInput).toHaveValue(String(DONATION_AMOUNT));

    const saveButton = page.getByRole("button", { name: "Сохранить" });
    await expect(saveButton).toBeEnabled({ timeout: 10_000 });
    const patched = page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        new URL(response.url()).pathname === `/widgets/${widgetId}`,
      { timeout: 30_000 },
    );
    await saveButton.click();
    const patchResponse = await patched;
    expect(
      patchResponse.ok(),
      `widget PATCH should succeed, got ${patchResponse.status()}`,
    ).toBeTruthy();
    await expect(saveButton).toBeDisabled({ timeout: 15_000 });

    // Verify the persisted goal config: mode=default, our title and amount.
    const storedWidget = await context.request.get(
      `${API_URL}/widgets/${widgetId}`,
      { headers: authHeaders },
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
    const storedGoal = (goalProperty?.value ?? [])[0] as GoalConfig | undefined;
    expect(storedGoal, "stored goal").toBeTruthy();
    expect(storedGoal?.mode).toBe("default");
    expect(storedGoal?.briefDescription).toBe(goalTitle);
    expect(storedGoal?.requiredAmount?.major).toBe(DONATION_AMOUNT);
    goalId = storedGoal?.id;
    expect(goalId, "stored goal id").toBeTruthy();

    // 4. The donation goal service mirrors the widget config into the payment
    // page config asynchronously (widget -> goal -> automation -> synced).
    // The payment page only renders "Сбор средств" once the goal is present,
    // and selects it by default when `isDefault` is true.
    if (debug) console.log(`waiting for payment page goal ${goalId}`);
    await expect
      .poll(
        async () => {
          const goals = await getPaymentPageGoals(context.request, ownerId);
          const goal = goals.find((it) => it.id === goalId);
          if (!goal) {
            return null;
          }
          return {
            briefDescription: goal.briefDescription,
            enabled: goal.enabled,
            isDefault: goal.isDefault,
          };
        },
        {
          timeout: 45_000,
          intervals: [500, 1_000, 2_000],
          message:
            "payment page config did not receive the default donation goal",
        },
      )
      .toEqual({
        briefDescription: goalTitle,
        enabled: true,
        isDefault: true,
      });

    // 5. Open the payment page and assert the goal is rendered in the "Сбор
    // средств" tab and is selected by default. `goalactive` is the CSS module
    // class the page adds to a selected goal.
    paymentPage = await context.newPage();
    const paymentLogs: string[] = [];
    collectLogs(paymentPage, "payment", paymentLogs);

    await paymentPage.goto(PAYMENT_PAGE_URL, {
      waitUntil: "domcontentloaded",
    });
    await expect(paymentPage.locator("body")).toContainText(
      `Донат для ${LOGIN}`,
      { timeout: 30_000 },
    );
    await expect(
      paymentPage.getByText("Сбор средств", { exact: true }),
    ).toBeVisible({ timeout: 30_000 });

    const selectedGoalCard = paymentPage
      .locator('[class*="goalactive"]')
      .filter({ hasText: goalTitle });
    await expect(selectedGoalCard).toBeVisible({ timeout: 20_000 });

    // 6. Donate 100 RUB and wait for the history item to receive its goal
    // label. The label is attached by the donation goal service from a
    // separate RabbitMQ event; that event can be consumed before the goal
    // link transaction is committed, leaving the item without a label. Every
    // attempt is a real fake-gateway payment with its own unique nickname, so
    // a lost race can be retried without touching the payment configuration.
    const nicknameBase = `e2e-user-${timestamp}`;
    const maxAttempts = 3;
    let paidNickname: string | undefined;
    let historyItemId: string | undefined;

    for (let attempt = 1; attempt <= maxAttempts && !paidNickname; attempt++) {
      const attemptNickname = `${nicknameBase}-${attempt}`;

      if (attempt > 1) {
        // The fake gateway redirects back to the donation page after every
        // payment, so wait for the reloaded page before editing the form.
        await expect(paymentPage.locator("body")).toContainText(
          `Донат для ${LOGIN}`,
          { timeout: 30_000 },
        );
        await expect(
          paymentPage
            .locator('[class*="goalactive"]')
            .filter({ hasText: goalTitle }),
        ).toBeVisible({ timeout: 20_000 });
      }

      // The nickname and amount are the only inputs needed; the amount is the
      // first input in the main form.
      await paymentPage
        .locator('input[placeholder="Аноним"]')
        .fill(attemptNickname);
      const amountInput = paymentPage.locator("input").first();
      await amountInput.fill(String(DONATION_AMOUNT));
      await amountInput.blur();
      await expect(amountInput).toHaveValue(String(DONATION_AMOUNT));

      const payButton = paymentPage
        .getByRole("button", { name: `Поддержать на ${DONATION_AMOUNT}₽` })
        .first();
      await expect(payButton).toBeEnabled({ timeout: 10_000 });

      const paymentCreated = paymentPage.waitForResponse(
        (response) =>
          response.request().method() === "PUT" &&
          new URL(response.url()).pathname === "/payments/commands/create",
        { timeout: 45_000 },
      );
      // The page reloads itself to the fake gateway's operation URL after the
      // draft is completed; wait for the config requested by that reload.
      const paymentPageReloaded = paymentPage.waitForResponse(
        (response) =>
          response.request().method() === "GET" &&
          new URL(response.url()).pathname === "/config/paymentpage",
        { timeout: 30_000 },
      );

      await payButton.click();
      const paymentResponse = await paymentCreated;
      expect(
        paymentResponse.ok(),
        `payment creation should succeed, got ${paymentResponse.status()}`,
      ).toBeTruthy();

      // The fake gateway completes the payment before returning, so the
      // request payload proves the default goal selection was actually used.
      const paymentPayload = paymentResponse.request().postDataJSON() as {
        goal?: string;
        nickname?: string;
        amount?: { major?: number };
      };
      expect(paymentPayload.goal).toBe(goalId);
      expect(paymentPayload.nickname).toBe(attemptNickname);
      expect(paymentPayload.amount?.major).toBe(DONATION_AMOUNT);

      await paymentPageReloaded;

      // Poll the API first so the history page is opened with the final row.
      if (debug) console.log(`waiting for history item of ${attemptNickname}`);
      try {
        await expect
          .poll(
            async () => {
              const items = await getHistoryItems(context.request, token);
              const item = items.find(
                (it) => it.nickname === attemptNickname,
              );
              historyItemId = item?.id;
              return (
                item?.goals?.map((goal) => ({
                  goalId: goal.goalId,
                  goalTitle: goal.goalTitle,
                })) ?? []
              );
            },
            {
              timeout: 20_000,
              intervals: [500, 1_000, 2_000],
              message:
                "history did not receive the donation with the goal label",
            },
          )
          .toContainEqual({ goalId, goalTitle });
        paidNickname = attemptNickname;
      } catch (error) {
        if (debug) {
          console.log(
            `attempt ${attempt}: history item lost the goal-label race`,
          );
        }
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }

    expect(paidNickname, "payment with a labelled history item").toBeTruthy();

    // 7. Open the history page and assert the new donation shows the goal
    // label. The row is scoped by the unique nickname of the successful
    // payment attempt.
    historyPage = await context.newPage();
    const historyLogs: string[] = [];
    collectLogs(historyPage, "history", historyLogs);

    const historyLoaded = historyPage.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        new URL(response.url()).pathname === "/history",
      { timeout: 30_000 },
    );
    await historyPage.goto(`${CONSOLE_URL}${HISTORY_PAGE_PATH}`, {
      waitUntil: "domcontentloaded",
    });
    await historyLoaded;

    const historyRow = historyPage
      .locator('[class*="singleitem"]')
      .filter({ hasText: paidNickname as string })
      .first();
    try {
      await expect(historyRow).toBeVisible({ timeout: 30_000 });
      await expect(historyRow).toContainText(`${DONATION_AMOUNT}₽`);
      await expect(historyRow).toContainText(goalTitle);
      if (debug) console.log(`history item ${historyItemId} shows ${goalTitle}`);
    } catch (error) {
      if (debug) {
        console.log("--- payment page console (tail) ---");
        console.log(paymentLogs.slice(-80).join("\n"));
        console.log("--- history page console (tail) ---");
        console.log(historyLogs.slice(-80).join("\n"));
        console.log("--- config page console (tail) ---");
        console.log(consoleLogs.slice(-80).join("\n"));
      }
      await historyPage.screenshot({
        path: "test-results/donation-goal-default-history-failure.png",
        fullPage: true,
      });
      throw error;
    }
  } finally {
    // 8. Best-effort cleanup: delete the widget (which also removes its goal
    // from the payment page config) and close the extra tabs.
    try {
      if (widgetId && accessToken) {
        const response = await context.request.delete(
          `${API_URL}/widgets/${widgetId}`,
          { headers: authHeaders },
        );
        if (debug) {
          console.log(
            `cleanup DELETE /widgets/${widgetId}: ${response.status()}`,
          );
        }

        // The deletion is mirrored into the payment page config through the
        // same event chain; wait for our goal to disappear so a run started
        // right after this one cannot see two default goals.
        if (goalId) {
          await expect
            .poll(
              async () => {
                const goals = await getPaymentPageGoals(
                  context.request,
                  ownerId,
                );
                return goals.some((goal) => goal.id === goalId);
              },
              { timeout: 15_000, intervals: [250, 500, 1_000] },
            )
            .toBe(false);
        }
      }
    } catch (error) {
      if (debug) console.log(`widget cleanup failed: ${String(error)}`);
    }

    try {
      if (historyPage) await historyPage.close();
      if (paymentPage) await paymentPage.close();
    } catch (error) {
      if (debug) console.log(`page cleanup failed: ${String(error)}`);
    }
  }
});
