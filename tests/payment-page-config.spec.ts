/**
 * End-to-end check that PaymentPageConfig changes made in the console are
 * reflected on the public payment page.
 *
 * Flow:
 *   1. read the current payment-page config for `testuser` (backup);
 *   2. log in to the console and open "Страница доната"
 *      (/configuration/payment-page), which is the UI for PaymentPageConfig;
 *   3. change every field that page exposes - the page text (arbitraryText),
 *      the footer description, the minimal donation amount, the self-employed
 *      details (ФИО / ИНН / e-mail) and the social links (update + add);
 *   4. save and verify the persisted config through the API;
 *   5. open the payment page on :3000 and assert each value is rendered there
 *      (the "Пользовательское соглашение" page is checked for ФИО/ИНН/e-mail);
 *   6. delete the added social link, save again and assert it disappears from
 *      the payment page;
 *   7. restore the original config in `finally` so the spec is idempotent.
 *
 * Not covered: the avatar and background image. They are uploaded to the CDN
 * as blobs (`logo-{recipientId}.png` / `back-{recipientId}.jpg`), are not part
 * of the PaymentPageConfig payload, and the local payment page build reads
 * them from https://api.oda.digital/public, so a local upload at
 * http://localhost:9000 cannot be observed on http://localhost:3000.
 *
 * Prerequisites for the local stack:
 *   - console dev server on http://localhost:3001 (PORT=3001);
 *   - payment page on http://localhost:3000 (oda-payment-page);
 *   - config API on http://localhost, payment page config owned by `testuser`
 *     with url = "localhost" (the payment page resolves its config by url).
 *
 * Run with:
 *   npx playwright test tests/payment-page-config.spec.ts --project=chromium \
 *     --reporter=line --workers=1
 *
 * The spec uses `channel: "chrome"` because the Playwright browser binaries are
 * not provisioned in this repo.
 */
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const CONSOLE_URL = "http://localhost:3001";
const PAYMENT_PAGE_URL = "http://localhost:3000";
const CONFIG_API_URL = "http://localhost";
const AUTH_URL = "https://auth.oda.digital";
const AUTH_CLIENT_ID = "oda-console";
const AUTH_CLIENT_SECRET = "TYaqCopUUsx2Jmakif55qBquZSUXOGhL";
const OWNER = "testuser";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";

type SocialLink = Record<string, string>;

interface PaymentPageConfigResponse {
  id: string;
  name: string;
  ownerId: string;
  url: string;
  value: Record<string, unknown>;
}

const SOCIAL_LABELS: Record<string, string> = {
  twitch: "Twitch",
  vk: "ВКонтакте",
  youtube: "YouTube",
  trovo: "Trovo",
  tiktok: "TikTok",
  boosty: "Boosty",
  kick: "Kick",
  goodgame: "GoodGame",
  telegram: "Telegram",
};

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(300_000);

function flattenSocials(value: unknown): Record<string, string> {
  if (!Array.isArray(value)) {
    return {};
  }
  return (value as SocialLink[]).reduce<Record<string, string>>(
    (result, entry) => ({ ...result, ...entry }),
    {},
  );
}

async function getPaymentPageConfig(
  request: APIRequestContext,
): Promise<PaymentPageConfigResponse> {
  const response = await request.get(
    `${CONFIG_API_URL}/config/paymentpage?ownerId=${OWNER}`,
  );
  expect(
    response.ok(),
    `GET /config/paymentpage?ownerId=${OWNER} returned ${response.status()}`,
  ).toBeTruthy();
  return (await response.json()) as PaymentPageConfigResponse;
}

/** Password grant used only for cleanup if the UI login did not finish. */
async function getAccessToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(
    `${AUTH_URL}/realms/ODA/protocol/openid-connect/token`,
    {
      form: {
        grant_type: "password",
        username: LOGIN,
        password: PASSWORD,
        client_id: AUTH_CLIENT_ID,
        client_secret: AUTH_CLIENT_SECRET,
        scope: "offline_access openid audience profile stomp",
      },
    },
  );
  expect(response.ok(), "Keycloak password grant").toBeTruthy();
  const body = (await response.json()) as { access_token: string };
  return body.access_token;
}

/**
 * Field labels ("ФИО", "Текст на странице", ...) are CSS-module classes, so
 * they are hashed in the DOM; match by substring. The input/textarea is a
 * sibling of the label inside the same field block.
 */
function fieldBlock(page: Page, label: string) {
  return page
    .locator('[class*="fieldname"]')
    .filter({ hasText: label })
    .first()
    .locator("..");
}

test("PaymentPageConfig reflects on the payment page", async ({
  context,
  page,
  request,
}) => {
  const originalConfig = await getPaymentPageConfig(request);
  let accessToken: string | undefined;

  // Unique values keep a failed/parallel run from being confused with the
  // values a previous run left behind (the backup is restored in `finally`).
  const suffix = `${Date.now()}`;
  const arbitraryText = `E2E текст на странице ${suffix}`;
  const description = `E2E подпись внизу страницы ${suffix}`;
  const minimalAmount =
    Number(originalConfig.value["minimalAmount"] ?? 40) === 137 ? 138 : 137;
  const fio = `E2E Тестов ${suffix}`;
  const inn = `77${suffix.slice(-8)}`;
  const email = `e2e-${suffix}@example.com`;

  const originalSocials = flattenSocials(originalConfig.value["url"]);
  const originalSocialKeys = Object.keys(originalSocials);
  const updatedSocialKey = originalSocialKeys[0];
  const updatedSocialUrl = `https://twitch.tv/e2e-updated-${suffix}`;
  const newSocialKey =
    Object.keys(SOCIAL_LABELS).find(
      (key) => !originalSocialKeys.includes(key),
    ) ?? "youtube";
  const newSocialUrl = `https://example.com/e2e-added-${suffix}`;

  try {
    await installKeycloakTokenProxy(context);
    await context.addInitScript(() => {
      try {
        localStorage.setItem("i18nextLng", "ru");
      } catch {
        // ignore
      }
    });

    // 1. Sign in through the real login form and open "Страница доната".
    // Open the login route directly: visiting /configuration/payment-page
    // while unauthenticated runs widgetSettingsLoader on both the parent
    // /configuration route and the child payment-page route; each calls
    // auth() and issues its own window.location.replace("/login?..."), so the
    // login page is navigated to twice (the first request is aborted).
    const configPageUrl = `${CONSOLE_URL}/configuration/payment-page`;
    await page.goto(
      `${CONSOLE_URL}/login?page=${encodeURIComponent(configPageUrl)}`,
      { waitUntil: "domcontentloaded" },
    );
    await page
      .locator(".login-container input")
      .waitFor({ state: "visible", timeout: 30_000 });
    await page.locator(".login-container input").fill(LOGIN);
    await page.locator(".password-container input").fill(PASSWORD);

    const initialConfigResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        new URL(response.url()).pathname === "/config/paymentpage",
      { timeout: 60_000 },
    );
    await page.locator("#login").click();

    await expect(
      page.getByRole("heading", { name: "Страница доната" }),
    ).toBeVisible({ timeout: 60_000 });
    expect((await initialConfigResponse).ok()).toBeTruthy();

    accessToken =
      (await page.evaluate(() => localStorage.getItem("access-token"))) ??
      undefined;

    // Wait until the form is populated with the stored config, so no edit is
    // overwritten by the async GET response.
    const arbitraryTextArea = fieldBlock(page, "Текст на странице").locator(
      "textarea",
    );
    await expect(arbitraryTextArea).toHaveValue(
      String(originalConfig.value["arbitraryText"] ?? ""),
      { timeout: 30_000 },
    );

    // 2. Edit every field exposed by the page.
    await arbitraryTextArea.fill(arbitraryText);

    const descriptionArea = fieldBlock(
      page,
      "Текст подписи внизу страницы",
    ).locator("textarea");
    await descriptionArea.fill(description);

    const minimalAmountInput = fieldBlock(
      page,
      "Минимальная сумма доната",
    ).locator("input");
    await minimalAmountInput.fill(String(minimalAmount));
    await minimalAmountInput.press("Tab");

    await fieldBlock(page, "ФИО").locator("input").fill(fio);
    await fieldBlock(page, "ИНН").locator("input").fill(inn);
    await fieldBlock(page, "Контактный e-mail")
      .locator("input")
      .fill(email);

    const socialRows = page.locator('[class*="sociallink"]');
    const originalSocialCount = await socialRows.count();
    if (updatedSocialKey) {
      await socialRows
        .first()
        .locator("input.ant-input")
        .fill(updatedSocialUrl);
    }

    await page
      .getByRole("button", { name: /Добавить ссылку/ })
      .click();
    await expect(socialRows).toHaveCount(originalSocialCount + 1, {
      timeout: 15_000,
    });

    const newSocialRow = socialRows.last();
    await newSocialRow.locator(".ant-select").click();
    await page
      .locator(
        ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
      )
      .filter({ hasText: SOCIAL_LABELS[newSocialKey] })
      .first()
      .click();
    await newSocialRow.locator("input.ant-input").fill(newSocialUrl);

    // 3. Save and wait for the write to complete.
    const saveButton = page.getByRole("button", {
      name: "Сохранить изменения",
    });
    await expect(saveButton).toBeVisible({ timeout: 15_000 });

    const saveResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === `/config/${originalConfig.id}`,
      { timeout: 30_000 },
    );
    await saveButton.click();
    expect((await saveResponse).ok()).toBeTruthy();

    // 4. The backend must have persisted the new values before the payment
    // page is opened (its config is fetched only on bootstrap).
    await expect
      .poll(
        async () => (await getPaymentPageConfig(request)).value,
        { timeout: 30_000, intervals: [250, 500, 1_000, 2_000] },
      )
      .toMatchObject({
        arbitraryText,
        "streamer.description": description,
        minimalAmount,
        fio,
        inn,
        email,
      });

    const expectedSocials: Record<string, string> = {
      [newSocialKey]: newSocialUrl,
    };
    if (updatedSocialKey) {
      expectedSocials[updatedSocialKey] = updatedSocialUrl;
    }
    await expect
      .poll(
        async () =>
          flattenSocials((await getPaymentPageConfig(request)).value["url"]),
        { timeout: 30_000, intervals: [250, 500, 1_000, 2_000] },
      )
      .toMatchObject(expectedSocials);

    // 5. Open the payment page and assert the visitor-facing rendering.
    const paymentPage = await context.newPage();
    await paymentPage.goto(PAYMENT_PAGE_URL, {
      waitUntil: "domcontentloaded",
    });

    await expect(paymentPage.locator("body")).toContainText(
      `Донат для ${OWNER}`,
      { timeout: 30_000 },
    );
    await expect(paymentPage.locator("body")).toContainText(arbitraryText);
    await expect(paymentPage.locator("body")).toContainText(
      `${OWNER} - ${description}`,
    );

    // minimalAmount is the initial amount and the payment threshold.
    await expect(paymentPage.locator("input").first()).toHaveValue(
      String(minimalAmount),
    );
    await expect(
      paymentPage.getByRole("button", {
        name: `Поддержать на ${minimalAmount}₽`,
      }),
    ).toBeVisible({ timeout: 30_000 });

    // Social links come from config.value["url"].
    await expect(
      paymentPage.locator(`a[href="${newSocialUrl}"]`),
    ).toBeVisible();
    if (updatedSocialKey) {
      await expect(
        paymentPage.locator(`a[href="${updatedSocialUrl}"]`),
      ).toBeVisible();
    }

    // ФИО / ИНН / e-mail are shown on the offer page linked from the footer.
    await paymentPage
      .getByRole("link", { name: "Пользовательское соглашение" })
      .click();
    await expect(paymentPage).toHaveURL(/\/offer$/, { timeout: 30_000 });
    const offerBody = paymentPage.locator("body");
    await expect(offerBody).toContainText(fio);
    await expect(offerBody).toContainText(inn);
    await expect(offerBody).toContainText(email);
    await paymentPage.close();

    // 6. Delete the social link that was added above, save, and assert the
    // deleteSocial path is reflected on the payment page too.
    await page.bringToFront();
    await expect(socialRows).toHaveCount(originalSocialCount + 1);
    await socialRows.last().locator('[class*="deletesocialbutton"]').click();
    await expect(socialRows).toHaveCount(originalSocialCount);

    const deleteSaveResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === `/config/${originalConfig.id}`,
      { timeout: 30_000 },
    );
    await page.getByRole("button", { name: "Сохранить изменения" }).click();
    expect((await deleteSaveResponse).ok()).toBeTruthy();

    await expect
      .poll(
        async () =>
          flattenSocials((await getPaymentPageConfig(request)).value["url"])[
            newSocialKey
          ],
        { timeout: 30_000, intervals: [250, 500, 1_000, 2_000] },
      )
      .toBeUndefined();

    const paymentPageAfterDelete = await context.newPage();
    await paymentPageAfterDelete.goto(PAYMENT_PAGE_URL, {
      waitUntil: "domcontentloaded",
    });
    // Wait for the config-driven marker before asserting the link is gone, so
    // the negative assertion cannot pass on a still-loading page.
    await expect(paymentPageAfterDelete.locator("body")).toContainText(
      arbitraryText,
      { timeout: 30_000 },
    );
    await expect(
      paymentPageAfterDelete.locator(`a[href="${newSocialUrl}"]`),
    ).toHaveCount(0);
    if (updatedSocialKey) {
      await expect(
        paymentPageAfterDelete.locator(`a[href="${updatedSocialUrl}"]`),
      ).toBeVisible();
    }
    await paymentPageAfterDelete.close();
  } finally {
    // 7. Restore the exact config that the test found, including id/url, so
    // repeated runs (and the local stack) are left untouched.
    const token = accessToken ?? (await getAccessToken(request));
    const restoreResponse = await request.post(
      `${CONFIG_API_URL}/config/${originalConfig.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: originalConfig,
      },
    );
    if (!restoreResponse.ok()) {
      throw new Error(
        `Failed to restore PaymentPageConfig: ${restoreResponse.status()} ${await restoreResponse.text()}`,
      );
    }

    await expect
      .poll(
        async () =>
          (await getPaymentPageConfig(request)).value["arbitraryText"],
        { timeout: 15_000 },
      )
      .toBe(originalConfig.value["arbitraryText"]);
  }
});
