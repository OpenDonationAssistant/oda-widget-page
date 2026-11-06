/**
 * End-to-end check for the Account page password flow.
 *
 * Flow:
 *   1. log in to the console as `testuser` / `testuserpassword` through the
 *      real login form and open the Account page from the toolbar;
 *   2. change the password to a random value through the "Смена пароля" modal;
 *   3. log out through the header account menu and log in again with the new
 *      password (the second login proves the change actually happened);
 *   4. open the Account page again and change the password back to
 *      `testuserpassword`.
 *
 * The original password is restored through the API in `finally` when the UI
 * flow fails halfway, so an interrupted run does not lock `testuser` out for
 * the other e2e specs.
 *
 * Prerequisites:
 *   - console dev server on http://localhost:3001;
 *   - recipient API on http://localhost and Keycloak at https://auth.oda.digital.
 *
 * Run it alone (it mutates the shared `testuser` password):
 *   npx playwright test tests/account-password-change.spec.ts \
 *     --project=chromium --reporter=line --workers=1
 *
 * The spec uses `channel: "chrome"` because the Playwright browser binaries are
 * not provisioned in this repo.
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
  type Response,
} from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const CONSOLE_URL = "http://localhost:3001";
const API_URL = "http://localhost";
const AUTH_URL = "https://auth.oda.digital";
const AUTH_CLIENT_ID = "oda-console";
const AUTH_CLIENT_SECRET = "TYaqCopUUsx2Jmakif55qBquZSUXOGhL";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";
const WIDGETS_URL = `${CONSOLE_URL}/configuration/widgets`;
const CHANGE_PASSWORD_URL = `${API_URL}/recipients/commands/changePassword`;
const SUCCESS_MESSAGE = "Пароль успешно изменен";

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

/**
 * Random password for the test run. The realm password policy is not known, so
 * the value covers upper case, lower case, digits and a special character.
 */
function randomPassword(): string {
  return `E2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-Aa1!`;
}

async function passwordGrant(
  request: APIRequestContext,
  password: string,
) {
  return request.post(
    `${AUTH_URL}/realms/ODA/protocol/openid-connect/token`,
    {
      form: {
        grant_type: "password",
        username: LOGIN,
        password,
        client_id: AUTH_CLIENT_ID,
        client_secret: AUTH_CLIENT_SECRET,
        scope: "offline_access openid audience profile stomp",
      },
    },
  );
}

/**
 * Last-resort restore used in `finally`: finds which of the known passwords is
 * currently active through a Keycloak password grant and, when it is the
 * random one, calls the same API endpoint the page uses. When the original
 * password already works, nothing is written.
 */
async function restorePasswordViaApi(
  request: APIRequestContext,
  candidates: string[],
): Promise<boolean> {
  for (const candidate of candidates) {
    const tokenResponse = await passwordGrant(request, candidate);
    if (!tokenResponse.ok()) {
      continue;
    }
    if (candidate === PASSWORD) {
      return true;
    }
    const { access_token } = (await tokenResponse.json()) as {
      access_token: string;
    };
    const response = await request.post(CHANGE_PASSWORD_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { oldPassword: candidate, newPassword: PASSWORD },
    });
    if (response.ok()) {
      return (await passwordGrant(request, PASSWORD)).ok();
    }
  }
  return false;
}

async function waitForLoginForm(page: Page): Promise<void> {
  await page
    .locator(".login-container input")
    .waitFor({ state: "visible", timeout: 60_000 });
}

async function submitLoginForm(page: Page, password: string): Promise<void> {
  await waitForLoginForm(page);
  await page.locator(".login-container input").fill(LOGIN);
  await page.locator(".password-container input").fill(password);
  await page.locator("#login").click();
}

async function login(page: Page, password: string): Promise<void> {
  // Opening the login route directly avoids the double loader redirect that a
  // protected route performs while unauthenticated.
  await page.goto(
    `${CONSOLE_URL}/login?page=${encodeURIComponent(WIDGETS_URL)}`,
    { waitUntil: "domcontentloaded" },
  );
  await submitLoginForm(page, password);
  await expect(page.locator("#widgetlistholder")).toBeVisible({
    timeout: 60_000,
  });
}

async function openAccountPage(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Аккаунт" }).click();
  await expect(page).toHaveURL(/\/configuration\/account$/);
  await expectAccountPage(page);
}

async function expectAccountPage(page: Page): Promise<void> {
  await expect(
    page.getByRole("heading", { name: "Настройки аккаунта" }),
  ).toBeVisible({ timeout: 60_000 });
}

/**
 * Opens the password dialog, submits it and waits for the server response.
 * The backend resets the credential before answering 200, so the caller must
 * confirm the response status before treating the new password as active.
 */
async function submitPasswordChange(
  page: Page,
  oldPassword: string,
  newPassword: string,
): Promise<Response> {
  await page
    .getByRole("button", { name: "Сменить пароль", exact: true })
    .click();
  await page
    .getByPlaceholder("Старый пароль", { exact: true })
    .fill(oldPassword);
  await page
    .getByPlaceholder("Новый пароль", { exact: true })
    .fill(newPassword);
  await page
    .getByPlaceholder("Повторите новый пароль", { exact: true })
    .fill(newPassword);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname ===
        "/recipients/commands/changePassword",
    { timeout: 60_000 },
  );
  await page.getByRole("button", { name: "Сменить", exact: true }).click();
  const response = await responsePromise;

  expect(response.request().postDataJSON()).toMatchObject({
    oldPassword,
    newPassword,
  });
  return response;
}

/**
 * The success dialog is rendered twice because two providers share the same
 * modal state, so the topmost "Закрыть" button is clicked.
 */
async function expectPasswordChanged(page: Page): Promise<void> {
  const successMessage = page.getByText(SUCCESS_MESSAGE, { exact: true });
  await expect(successMessage.first()).toBeVisible({ timeout: 30_000 });
  await page
    .getByRole("button", { name: "Закрыть", exact: true })
    .last()
    .click();
  await expect(successMessage).toHaveCount(0);
}

async function logout(page: Page): Promise<void> {
  await page.locator('[class*="account"]').first().click();
  await page.getByRole("menuitem", { name: "Выйти", exact: true }).click();
  await waitForLoginForm(page);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("access-token")))
    .toBeNull();
}

test("Account page: change password, log in with it, restore the original", async ({
  context,
  page,
  request,
}) => {
  const newPassword = randomPassword();
  // Set before the request is sent: even a timed-out response may have already
  // reset the credential on the server.
  let passwordChangeAttempted = false;
  let passwordRestored = false;

  try {
    await installKeycloakTokenProxy(context);
    await context.addInitScript(() => {
      try {
        localStorage.setItem("i18nextLng", "ru");
      } catch {
        // ignore
      }
    });

    // 1. Log in and reach the Account page through the toolbar.
    await login(page, PASSWORD);
    await openAccountPage(page);

    // 2. Change the password through the page.
    passwordChangeAttempted = true;
    const changeResponse = await submitPasswordChange(
      page,
      PASSWORD,
      newPassword,
    );
    expect(
      changeResponse.status(),
      "POST /recipients/commands/changePassword",
    ).toBe(200);
    await expectPasswordChanged(page);

    // 3. Log out and prove the new credentials work in a fresh login.
    await logout(page);
    await submitLoginForm(page, newPassword);
    await expect(page.locator("#widgetlistholder")).toBeVisible({
      timeout: 60_000,
    });
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("access-token")))
      .not.toBeNull();

    // 4. Change the password back to the original one.
    await openAccountPage(page);
    const restoreResponse = await submitPasswordChange(
      page,
      newPassword,
      PASSWORD,
    );
    expect(
      restoreResponse.status(),
      "POST /recipients/commands/changePassword",
    ).toBe(200);
    passwordRestored = true;
    await expectPasswordChanged(page);

    // The UI response is 200 only after Keycloak reset the credential, so the
    // original password must already be accepted again.
    const restored = await passwordGrant(request, PASSWORD);
    expect(
      restored.ok(),
      "Keycloak accepts the restored testuserpassword",
    ).toBeTruthy();
  } finally {
    if (passwordChangeAttempted && !passwordRestored) {
      const restored = await restorePasswordViaApi(request, [
        newPassword,
        PASSWORD,
      ]).catch(() => false);
      if (!restored) {
        console.warn(
          `Could not restore the ${LOGIN} password to the original value`,
        );
      }
    }
  }
});
