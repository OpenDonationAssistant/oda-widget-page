// Keep the unit test isolated from the logger's worker/IPC import chain.
jest.mock("../logging", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { sanitizeEmoteResponses } from "./emoteCache";

describe("sanitizeEmoteResponses", () => {
  it("returns an empty list for non-array input", () => {
    expect(sanitizeEmoteResponses(undefined)).toEqual([]);
    expect(sanitizeEmoteResponses(null)).toEqual([]);
    expect(sanitizeEmoteResponses({})).toEqual([]);
    expect(sanitizeEmoteResponses("nope")).toEqual([]);
  });

  it("drops records with missing or malformed key/savedAt", () => {
    const records = [
      { key: "global", savedAt: 123, items: [] },
      { savedAt: 123, items: [] },
      { key: "global", items: [] },
      { key: 42, savedAt: 123, items: [] },
      { key: "global", savedAt: "later", items: [] },
    ];
    expect(sanitizeEmoteResponses(records)).toEqual([
      { key: "global", savedAt: 123, items: [] },
    ]);
  });

  it("drops records whose items are not an array", () => {
    const records = [
      { key: "global", savedAt: 1, items: [] },
      { key: "global", savedAt: 1, items: "not-an-array" },
      { key: "global", savedAt: 1 },
    ];
    expect(sanitizeEmoteResponses(records)).toEqual([
      { key: "global", savedAt: 1, items: [] },
    ]);
  });

  it("keeps valid emote items and filters out malformed ones", () => {
    const records = [
      {
        key: "global",
        savedAt: 1,
        items: [
          { id: "abc", name: "Pog", data: {} },
          { id: "cached", name: "Keep", data: { animated: true } },
          { id: "no-name" },
          { name: "no-id" },
          null,
          "string",
          42,
        ],
      },
    ];
    expect(sanitizeEmoteResponses(records)).toEqual([
      {
        key: "global",
        savedAt: 1,
        items: [
          { id: "abc", name: "Pog", data: {} },
          { id: "cached", name: "Keep", data: { animated: true } },
        ],
      },
    ]);
  });
});