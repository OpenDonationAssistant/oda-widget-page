jest.mock("@opendonationassistant/oda-recipient-service-client", () => ({
  DefaultApiFactory: jest.fn(() => ({
    listTokens: jest.fn(),
  })),
}));

import { DefaultApiFactory } from "@opendonationassistant/oda-recipient-service-client";
import {
  HANDLER_TOKEN_SYSTEM,
  availableTokens,
  hasLinkedToken,
} from "./systems";

const factoryAsUnknown = DefaultApiFactory as unknown;
const serviceMock = (factoryAsUnknown as jest.Mock).mock.results[0].value;

const twitchToken = {
  id: "1",
  system: "Twitch",
  type: "accessToken",
  token: "abc",
  enabled: true,
  settings: {},
};
const googleApiKeyToken = {
  id: "2",
  system: "GoogleApiKey",
  type: "accessToken",
  token: "def",
  enabled: true,
  settings: {},
};

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
  it("returns the linked tokens", async () => {
    serviceMock.listTokens.mockResolvedValue({
      data: [twitchToken, googleApiKeyToken],
    });

    const tokens = await availableTokens("oda-token");

    expect(serviceMock.listTokens).toHaveBeenCalledWith({
      headers: { Authorization: "Bearer oda-token" },
    });
    expect(tokens).toHaveLength(2);
  });

  it("returns null when the token list cannot be fetched", async () => {
    serviceMock.listTokens.mockRejectedValue(new Error("offline"));

    const tokens = await availableTokens("oda-token");

    expect(tokens).toBeNull();
  });
});