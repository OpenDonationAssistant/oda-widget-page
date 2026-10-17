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
 * be fetched. Callers should treat `null` as "unknown" and fall back to
 * registering everything rather than dropping handlers.
 */
export async function availableTokens(
  odaToken: string,
): Promise<TokenDto[] | null> {
  const headers = { Authorization: `Bearer ${odaToken}` };
  try {
    const response = await listTokens({
      headers,
      timeout: TOKEN_LIST_TIMEOUT_MS,
      baseURL: RECIPIENT_API_ENDPOINT,
      throwOnError: true,
    });
    return await Promise.all(
      response.data.map(async (info) => ({
        ...info,
        token: (
          await getAccessToken({
            body: { tokenId: info.id },
            headers,
            timeout: TOKEN_LIST_TIMEOUT_MS,
            baseURL: RECIPIENT_API_ENDPOINT,
            throwOnError: true,
          })
        ).data.token,
      })),
    );
  } catch (error) {
    log("ERROR", "Failed to list recipient tokens", error);
    return null;
  }
}

/**
 * Whether the recipient has a token for the given handler's system. Unknown
 * availability (`null`) is treated as "yes" so no handler is skipped when the
 * token list could not be fetched.
 */
export function hasLinkedToken(
  tokens: TokenDto[] | null,
  handler: string,
): boolean {
  if (tokens === null) return true;
  return tokens.some((token) => token.system === HANDLER_TOKEN_SYSTEM[handler]);
}