jest.mock("@opendonationassistant/recipient-service", () => ({
  listTokens: jest.fn(),
  getAccessToken: jest.fn(),
}));

import {
  getAccessToken,
  listTokens,
} from "@opendonationassistant/recipient-service";
import {
  HANDLER_TOKEN_SYSTEM,
  availableTokens,
  hasLinkedToken,
} from "./systems";

const listTokensMock = listTokens as unknown as jest.Mock;
const getAccessTokenMock = getAccessToken as unknown as jest.Mock;

const twitchToken = {
  id: "1",
  system: "Twitch",
  type: "accessToken",
  enabled: true,
  settings: {},
  scopes: [],
  token: "stale",
};
const googleApiKeyToken = {
  id: "2",
  system: "GoogleApiKey",
  type: "accessToken",
  enabled: true,
  settings: {},
  scopes: [],
  token: "stale",
};

beforeEach(() => {
  listTokensMock.mockReset();
  getAccessTokenMock.mockReset();
});

describe("HANDLER_TOKEN_SYSTEM", () => {
  it("maps handler names to their token systems", () => {
    expect(HANDLER_TOKEN_SYSTEM["Twitch"]).toBe("Twitch");
    expect(HANDLER_TOKEN_SYSTEM["VKLive"]).toBe("VKLive");
    expect(HANDLER_TOKEN_SYSTEM["Kick"]).toBe("Kick");
    expect(HANDLER_TOKEN_SYSTEM["Youtube"]).toBe("GoogleApiKey");
    expect(HANDLER_TOKEN_SYSTEM["StreamElements"]).toBe("StreamElements");
    expect(HANDLER_TOKEN_SYSTEM["DonationAlerts"]).toBe("DonationAlerts");
    expect(HANDLER_TOKEN_SYSTEM["DonatePay"]).toBe("DonatePay");
    expect(HANDLER_TOKEN_SYSTEM["DonatePay.eu"]).toBe("DonatePay.eu");
    expect(HANDLER_TOKEN_SYSTEM["UnofficialDonationAlerts"]).toBe(
      "UnofficialDonationAlerts",
    );
    expect(HANDLER_TOKEN_SYSTEM["DonateX"]).toBe("DonateX");
  });
});

describe("hasLinkedToken", () => {
  it("returns true for unknown availability so no handler is skipped", () => {
    expect(hasLinkedToken(null, "Twitch")).toBe(true);
  });

  it("returns true when the system has a linked token", () => {
    const tokens = [twitchToken, googleApiKeyToken];
    expect(hasLinkedToken(tokens, "Twitch")).toBe(true);
    expect(hasLinkedToken(tokens, "Youtube")).toBe(true);
  });

  it("returns false when the system has no linked token", () => {
    const tokens = [twitchToken];
    expect(hasLinkedToken(tokens, "Kick")).toBe(false);
    expect(hasLinkedToken(tokens, "DonateX")).toBe(false);
  });
});

describe("availableTokens", () => {
  it("returns the linked tokens enriched with their access token", async () => {
    listTokensMock.mockResolvedValue({
      data: [twitchToken, googleApiKeyToken],
    });
    getAccessTokenMock.mockResolvedValue({ data: { token: "resolved" } });

    const tokens = await availableTokens("oda-token");

    expect(listTokensMock).toHaveBeenCalledWith({
      headers: { Authorization: "Bearer oda-token" },
      timeout: 10000,
      baseURL: expect.any(String),
      throwOnError: true,
    });
    expect(getAccessTokenMock).toHaveBeenCalledTimes(2);
    expect(tokens).toHaveLength(2);
    expect(tokens?.every((token) => token.token === "resolved")).toBe(true);
  });

  it("returns null when the token list cannot be fetched", async () => {
    listTokensMock.mockRejectedValue(new Error("offline"));

    const tokens = await availableTokens("oda-token");

    expect(tokens).toBeNull();
  });
});
