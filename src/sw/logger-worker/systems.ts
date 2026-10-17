/// <reference lib="webworker" />

import {
  getAccessToken,
  listTokens,
  type TokenControllerTokenInfoDto,
} from "@opendonationassistant/recipient-service";
import { log } from "./handlers/log";

// Endpoint comes from the build-time environment, with a fallback to the
// production gateway (same pattern as the chat/donation handlers).
const RECIPIENT_API_ENDPOINT =
  process.env.REACT_APP_RECIPIENT_API_ENDPOINT ?? "https://api.oda.digital";

/** How long to wait for the token list before falling back to "unknown". */
const TOKEN_LIST_TIMEOUT_MS = 10000;

/**
 * A recipient token as returned by the recipient-service list endpoint,
 * enriched with the token secret fetched via `getAccessToken`.
 */
export type TokenDto = TokenControllerTokenInfoDto & { token: string };

/**
 * Maps the worker handler name (as reported via `reportStarted`/`reportError`)
 * to the token `system` value that handler connects with. A handler is only
 * registered — and only waited on for status updates — when the recipient has
 * at least one token for its system.
 */
export const HANDLER_TOKEN_SYSTEM: Record<string, string> = {
  Twitch: "Twitch",
  VKLive: "VKLive",
  Kick: "Kick",
  Youtube: "GoogleApiKey",
  StreamElements: "StreamElements",
  DonationAlerts: "DonationAlerts",
  DonatePay: "DonatePay",
  "DonatePay.eu": "DonatePay.eu",
  UnofficialDonationAlerts: "UnofficialDonationAlerts",
  DonateX: "DonateX",
};

/**
 * Returns the tokens linked to the recipient, or `null` when the list cannot
 * be fetched. `null` means availability is unknown and `hasLinkedToken` treats
 * it as "no tokens", so affected handlers are skipped.
 *
 * Each token's secret is resolved independently, so one failing token keeps
 * the rest of the list intact.
 */
export async function availableTokens(
  odaToken: string,
): Promise<TokenDto[] | null> {
  try {
    const response = await listTokens({
      headers: { Authorization: `Bearer ${odaToken}` },
      timeout: TOKEN_LIST_TIMEOUT_MS,
      baseURL: RECIPIENT_API_ENDPOINT,
      throwOnError: true,
    });
    return await Promise.all(
      response.data.map(async (info) => ({
        ...info,
        token: await accessTokenFor(info.id, odaToken),
      })),
    );
  } catch (error) {
    log("ERROR", "Failed to list recipient tokens", error);
    return null;
  }
}

/**
 * Fetches a single token's secret, tolerating a per-token failure so one
 * broken token does not drop the whole list. Returns "" when unavailable.
 */
async function accessTokenFor(
  tokenId: string,
  odaToken: string,
): Promise<string> {
  try {
    const response = await getAccessToken({
      body: { tokenId: tokenId },
      headers: { Authorization: `Bearer ${odaToken}` },
      timeout: TOKEN_LIST_TIMEOUT_MS,
      baseURL: RECIPIENT_API_ENDPOINT,
      throwOnError: true,
    });
    return response.data.token;
  } catch (error) {
    log("ERROR", `Failed to fetch access token for ${tokenId}`, error);
    return "";
  }
}

export function hasLinkedToken(
  tokens: TokenDto[] | null,
  handler: string,
): boolean {
  if (tokens === null) return false;
  return tokens.some((token) => token.system === HANDLER_TOKEN_SYSTEM[handler]);
}

