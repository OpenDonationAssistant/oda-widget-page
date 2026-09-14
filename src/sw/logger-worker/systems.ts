/// <reference lib="webworker" />

import {
  DefaultApiFactory as RecipientService,
  type TokenControllerTokenDto,
} from "@opendonationassistant/oda-recipient-service-client";
import { log } from "./handlers/log";

// Endpoint comes from the build-time environment, with a fallback to the
// production gateway (same pattern as the chat/donation handlers).
const RECIPIENT_API_ENDPOINT =
  process.env.REACT_APP_RECIPIENT_API_ENDPOINT ?? "https://api.oda.digital";

const recipientService = RecipientService(undefined, RECIPIENT_API_ENDPOINT);

/** A recipient token as returned by the recipient-service list endpoint. */
export type TokenDto = TokenControllerTokenDto;

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
  try {
    const response = await recipientService.listTokens({
      headers: { Authorization: `Bearer ${odaToken}` },
    });
    return response.data;
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