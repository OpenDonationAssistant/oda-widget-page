/**
 * End-to-end check of the media player request flow:
 *
 *   1. login through the real login form;
 *   2. add a "Медиаплеер" widget and set its request cost ("Стоимость
 *      одной ссылки") to 100 RUB;
 *   3. open the player widget in a second tab;
 *   4. open the donation page on http://localhost:3000 in a third tab and
 *      assert it renders the "Заказ музыки" section;
 *   5. request a VKVideo media and pay 100 RUB for it through the fake
 *      gateway;
 *   6. assert the requested media (title and donor nickname) shows up in
 *      the player playlist without reloading that tab.
 *
 * Prerequisites for the local stack:
 *   - console dev server on http://localhost:3001
 *   - donation page dev server on http://localhost:3000
 *   - API gateway on http://localhost with the "fake" fiat gateway enabled
 *     (`GET /payments/gateways?recipientId=testuser`)
 *   - STOMP broker at ws://localhost/ws; the media service must publish the
 *     completed payment's media to the recipient's player topic
 *
 * Run with:
 *   npx playwright test tests/media-widget-request.spec.ts --project=chromium --reporter=line
 *
 * The spec uses `channel: "chrome"` (installed Google Chrome) because the
 * Playwright browser binaries are not provisioned in this repo.
 */
import { expect, test, type Page } from "@playwright/test";
import { installKeycloakTokenProxy } from "./support/keycloak";

const BASE_URL = "http://localhost:3001";
const DONATION_URL = "http://localhost:3000";
const API_URL = "http://localhost";
const WS_URL = "ws://localhost/ws";
const LOGIN = "testuser";
const PASSWORD = "testuserpassword";
const WIDGET_TITLE = "Медиаплеер";
const MUSIC_TAB = "Заказ музыки";
const MEDIA_URL = "https://vkvideo.ru/video-25319313_456240536";
// Origin id VK assigns to MEDIA_URL; used to prove the player playlist starts
// clean and to drop leftovers of previous runs.
const MEDIA_ORIGIN_ID = "-25319313_456240536";
const MEDIA_TITLE = "Otherside (1080p)";
const SONG_COST = 100;

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
      if (payload.startsWith("CONNECTED")) {
        state.connected = true;
      }
      if (debug) {
        console.log(`[${label} ws] ${payload.slice(0, 300)}`);
      }
    });
  });
  return state;
}

test.use({ channel: "chrome", viewport: { width: 1600, height: 1000 } });
test.setTimeout(240_000);

test("media widget plays a paid media request", async ({ context, page }) => {
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

  const accessToken = await page.evaluate(() =>
    localStorage.getItem("access-token"),
  );
  expect(accessToken, "access token in localStorage").toBeTruthy();
  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  let widgetId: string | undefined;
  let mediaId: string | undefined;
  let widgetPage: Page | undefined;
  let donationPage: Page | undefined;

  try {
    // The fixed media URL is reused by every run. Ready videos of the same
    // origin are loaded into the player playlist on startup and would make
    // the app ignore the newly paid request (the Playlist skips duplicate
    // origin ids), so mark leftovers as handled before opening the player.
    const readyVideos = await context.request.get(`${API_URL}/media/video`, {
      headers: authHeaders,
    });
    expect(
      readyVideos.ok(),
      `media list GET should succeed, got ${readyVideos.status()}`,
    ).toBeTruthy();
    const staleVideos = (await readyVideos.json()) as {
      id: string;
      originId: string;
    }[];
    for (const video of staleVideos) {
      if (video.originId === MEDIA_ORIGIN_ID) {
        const response = await context.request.patch(
          `${API_URL}/media/video/${video.id}`,
        );
        expect(
          response.ok(),
          `marking stale media ${video.id} handled should succeed`,
        ).toBeTruthy();
        if (debug) console.log(`marked stale media ${video.id} as handled`);
      }
    }

    // 2. Create the media widget through the add-widget wizard.
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
    const ownerId = created.ownerId ?? LOGIN;
    expect(widgetId, "created widget id").toBeTruthy();
    if (debug) console.log(`created media widget ${widgetId}`);

    // 3. Open the widget settings. The modal opens by itself only when the
    // wizard applied a preset, so fall back to clicking the widget row.
    const generalTab = page.getByRole("tab", { name: "Общие" });
    if (!(await generalTab.isVisible({ timeout: 5_000 }).catch(() => false))) {
      if (debug) console.log("widget settings modal not open, clicking row");
      await page
        .locator(".widget-title", { hasText: WIDGET_TITLE })
        .last()
        .click();
    }
    await expect(generalTab).toBeVisible({ timeout: 20_000 });
    await generalTab.click();

    // Set "Стоимость одной ссылки" to 100 RUB. The default is already 100, so
    // nudge it to 101 and save first; that makes the form dirty and exercises
    // the save path before setting the requested value.
    const costItem = page
      .locator(".settings-item")
      .filter({ hasText: "Стоимость видео" })
      .first();
    await expect(costItem).toBeVisible({ timeout: 15_000 });
    const costInput = costItem.locator('input[role="spinbutton"]').first();
    const initialCost = Number(await costInput.inputValue());
    const saveButton = page.getByRole("button", { name: "Сохранить" });

    await costInput.fill(String(initialCost + 1));
    await costInput.press("Tab");
    await expect(saveButton).toBeEnabled({ timeout: 10_000 });
    const firstPatch = page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        new URL(response.url()).pathname === `/widgets/${widgetId}`,
      { timeout: 30_000 },
    );
    await saveButton.click();
    expect(
      (await firstPatch).ok(),
      "widget PATCH with the temporary cost should succeed",
    ).toBeTruthy();
    await expect(saveButton).toBeDisabled({ timeout: 15_000 });

    await costInput.fill(String(SONG_COST));
    await costInput.press("Tab");
    await expect(costInput).toHaveValue(String(SONG_COST));
    await expect(saveButton).toBeEnabled({ timeout: 10_000 });
    const secondPatch = page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        new URL(response.url()).pathname === `/widgets/${widgetId}`,
      { timeout: 30_000 },
    );
    await saveButton.click();
    expect(
      (await secondPatch).ok(),
      "widget PATCH with the 100 RUB cost should succeed",
    ).toBeTruthy();
    await expect(saveButton).toBeDisabled({ timeout: 15_000 });

    // Verify the persisted widget config directly.
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
    const tarification = (storedJson.config?.properties ?? []).find(
      (property) => property.name === "tarification",
    );
    expect(tarification, "tarification property in stored config").toBeTruthy();
    expect(tarification?.value?.method).toBe("perLink");
    expect(tarification?.value?.cost).toBe(SONG_COST);

    // The media service mirrors the widget settings into the payment page
    // config asynchronously (through the widget-changed event). The donation
    // page only renders "Заказ музыки" once requests are enabled and no
    // longer marked as permanently disabled.
    await expect
      .poll(
        async () => {
          const response = await context.request.get(
            `${API_URL}/config/paymentpage?ownerId=${ownerId}`,
          );
          const json = (await response.json()) as {
            value?: Record<string, any>;
          };
          return {
            enabled: json.value?.["media.requests.enabled"],
            disabledPermanently:
              json.value?.["media.requests.disabled.permanently"],
            cost: json.value?.["media.requests.cost"],
          };
        },
        {
          timeout: 30_000,
          intervals: [500, 1_000, 2_000],
          message: "payment page did not receive the media widget settings",
        },
      )
      .toEqual({
        enabled: true,
        disabledPermanently: false,
        cost: SONG_COST,
      });

    // 4. Open the player widget in a second tab of the same context. It
    // shares localStorage with the config tab, so the same session is used.
    widgetPage = await context.newPage();
    const widgetConsoleLogs: string[] = [];
    widgetPage.on("console", (message) => {
      const line = `[widget console:${message.type()}] ${message.text()}`;
      widgetConsoleLogs.push(line);
      if (debug) console.log(line);
    });

    const widgetStomp = watchStomp(widgetPage, "media-widget");
    const widgetSettingsLoaded = widgetPage.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        new URL(response.url()).pathname === `/widgets/${widgetId}`,
      { timeout: 30_000 },
    );
    const mediaListLoaded = widgetPage.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        new URL(response.url()).pathname === "/media/video",
      { timeout: 30_000 },
    );
    await widgetPage.goto(`${BASE_URL}/media/${widgetId}`, {
      waitUntil: "domcontentloaded",
    });
    await widgetSettingsLoaded;
    await mediaListLoaded;
    await expect
      .poll(() => widgetStomp.connected, {
        timeout: 20_000,
        message: "media widget STOMP client did not connect in 20s",
      })
      .toBe(true);
    // Let the SUBSCRIBE frames reach the broker before publishing a payment.
    await widgetPage.waitForTimeout(2_000);
    // The playlist is preloaded from ready videos, but leftovers of this
    // media were marked as handled above, so the song is not there yet.
    await expect(
      widgetPage.locator(".song-title", { hasText: MEDIA_TITLE }),
    ).toHaveCount(0, { timeout: 10_000 });

    // 5. Open the donation page in a third tab. It loads the same testuser
    // config we waited for above, so the music request tab must be rendered.
    donationPage = await context.newPage();
    const donationConsoleLogs: string[] = [];
    donationPage.on("console", (message) => {
      const line = `[donation console:${message.type()}] ${message.text()}`;
      donationConsoleLogs.push(line);
      if (debug) console.log(line);
    });

    await donationPage.goto(DONATION_URL, { waitUntil: "domcontentloaded" });
    const musicTab = donationPage.getByText(MUSIC_TAB, { exact: true });
    await expect(musicTab).toBeVisible({ timeout: 30_000 });
    await musicTab.click();

    // 6. Request the media. The donation page resolves the URL through the
    // media service and shows the parsed title.
    const timestamp = Date.now();
    const nickname = `e2e-user-${timestamp}`;
    await donationPage.locator('input[placeholder="Аноним"]').fill(nickname);

    const mediaAdded = donationPage.waitForResponse(
      (response) =>
        response.request().method() === "PUT" &&
        new URL(response.url()).pathname === "/media/video",
      { timeout: 30_000 },
    );
    await donationPage
      .locator('input[placeholder="Название, ссылка Youtube или VKVideo"]')
      .fill(MEDIA_URL);
    const mediaResponse = await mediaAdded;
    expect(
      mediaResponse.ok(),
      `media request PUT should succeed, got ${mediaResponse.status()}`,
    ).toBeTruthy();
    const media = (await mediaResponse.json()) as {
      id: string;
      originId: string;
      title: string;
      cost: { major: number };
    };
    mediaId = media.id;
    expect(media.originId).toBe(MEDIA_ORIGIN_ID);
    expect(media.title).toBe(MEDIA_TITLE);
    expect(media.cost.major).toBe(SONG_COST);

    const mediaItem = donationPage
      .locator('[class*="mediatitle"]')
      .filter({ hasText: media.title })
      .first();
    await expect(mediaItem).toBeVisible({ timeout: 15_000 });

    // The request raises the minimal donation to its cost; pay exactly that.
    // The amount input is the first one in the main donation form.
    const amountInput = donationPage.locator("input").first();
    await amountInput.fill(String(SONG_COST));
    await amountInput.blur();
    await expect(amountInput).toHaveValue(String(SONG_COST));

    const payButton = donationPage
      .getByRole("button", { name: `Поддержать на ${SONG_COST}₽` })
      .first();
    await expect(payButton).toBeEnabled({ timeout: 10_000 });
    if (debug) console.log(`paying ${SONG_COST} RUB for ${mediaId}`);

    // The fake gateway completes the payment as soon as the draft is created
    // and redirects back to the donation page, so the response body is not
    // readable after the navigation. The status code is enough here.
    const paymentCreated = donationPage.waitForResponse(
      (response) =>
        response.request().method() === "PUT" &&
        new URL(response.url()).pathname === "/payments/commands/create",
      { timeout: 45_000 },
    );
    await payButton.click();
    const paymentResponse = await paymentCreated;
    expect(
      paymentResponse.ok(),
      `payment creation should succeed, got ${paymentResponse.status()}`,
    ).toBeTruthy();

    // 7. The player tab must receive the media over STOMP and render it in
    // the requested playlist under the donor's nickname.
    const requestedItem = widgetPage
      .locator("#playlist li.list-group-item")
      .filter({ hasText: nickname })
      .filter({ hasText: media.title })
      .first();
    try {
      await expect(requestedItem).toBeVisible({ timeout: 45_000 });
      await expect(requestedItem).toContainText(`Заказал: ${nickname}`);
    } catch (error) {
      if (debug) {
        console.log("--- widget page console ---");
        console.log(widgetConsoleLogs.join("\n"));
        console.log("--- donation page console (tail) ---");
        console.log(donationConsoleLogs.slice(-80).join("\n"));
        console.log("--- config page console (tail) ---");
        console.log(consoleLogs.slice(-80).join("\n"));
      }
      await widgetPage.screenshot({
        path: "test-results/media-widget-request-failure.png",
        fullPage: true,
      });
      throw error;
    }
  } finally {
    // Best-effort cleanup of the media, the widget and the extra tabs so
    // repeated runs stay independent. Each step is isolated: a failed media
    // patch must not keep the widget behind.
    try {
      if (mediaId) {
        await context.request.patch(`${API_URL}/media/video/${mediaId}`);
        if (debug) console.log(`cleanup marked media ${mediaId} as handled`);
      }
    } catch (error) {
      if (debug) console.log(`media cleanup failed: ${String(error)}`);
    }

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
      }
    } catch (error) {
      if (debug) console.log(`widget cleanup failed: ${String(error)}`);
    }

    try {
      if (donationPage) await donationPage.close();
      if (widgetPage) await widgetPage.close();
    } catch (error) {
      if (debug) console.log(`page cleanup failed: ${String(error)}`);
    }
  }
});
