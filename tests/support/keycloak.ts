import { BrowserContext, request } from "@playwright/test";

/**
 * Keycloak (auth.oda.digital) does not send CORS headers for the console
 * origin (http://localhost:3001), so the browser refuses to read the token
 * response. Playwright runs the request server-side (no Origin header, so
 * Keycloak does not reject it) and fulfills the browser route with CORS
 * headers attached. This keeps the application's genuine login form and real
 * credentials intact.
 *
 * The route stays registered for the lifetime of the context because the app
 * also refreshes the token from src/socket.ts and repeats password/refresh
 * grants on every page load while a session exists.
 */
export async function installKeycloakTokenProxy(
  context: BrowserContext,
): Promise<void> {
  const api = await request.newContext();

  await context.route(
    "**/realms/ODA/protocol/openid-connect/token",
    async (route) => {
      const req = route.request();
      const origin = req.headers()["origin"] ?? "http://localhost:3001";

      const cors = {
        "access-control-allow-origin": origin,
        "access-control-allow-credentials": "true",
        "access-control-allow-headers":
          "Authorization, Content-Type, Accept, Origin, X-Requested-With",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      };

      if (req.method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: cors });
        return;
      }

      const contentType =
        req.headers()["content-type"] ?? "application/x-www-form-urlencoded";

      const response = await api.fetch(req.url(), {
        method: "POST",
        headers: { "content-type": contentType },
        data: req.postData() ?? undefined,
      });

      await route.fulfill({
        status: response.status(),
        headers: {
          ...cors,
          "content-type": "application/json",
        },
        body: await response.text(),
      });
    },
  );
}
