// Keep the unit test isolated from the logger's worker/IPC import chain.
jest.mock("../logging", () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import {
  DefaultEmotesStore,
  SEVENTV_CDN,
  SevenTVEmote,
} from "./EmotesStore";
import { EmoteResponseCache } from "./emoteCache";

class InMemoryEmoteCache implements EmoteResponseCache<SevenTVEmote> {
  private readonly entries = new Map<string, SevenTVEmote[]>();

  public readonly read = jest.fn(async (key: string) => this.entries.get(key));

  public readonly write = jest.fn(
    async (key: string, items: SevenTVEmote[]) => {
      this.entries.set(key, items);
    },
  );

  public seed(key: string, items: SevenTVEmote[]): void {
    this.entries.set(key, items);
  }
}

const emote = (id: string, name: string): SevenTVEmote => ({
  id,
  name,
  data: {
    animated: false,
    host: { files: [{ name: "1x.webp" }] },
    owner: { display_name: "oda" },
  },
});

const okResponse = (payload: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  } as unknown as Response);

const globalPayload = (emotes: SevenTVEmote[]) => ({
  data: { namedEmoteSet: { emotes } },
});

const channelPayload = (emotes: SevenTVEmote[]) => ({
  data: { userByConnection: { emote_sets: [{ emotes }] } },
});

describe("DefaultEmotesStore response caching", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("persists a successful global response", async () => {
    const cache = new InMemoryEmoteCache();
    globalThis.fetch = jest.fn(() =>
      okResponse(globalPayload([emote("abc", "Pog")])),
    ) as unknown as typeof fetch;

    const store = new DefaultEmotesStore({ cache });
    await store.load();

    expect(cache.write).toHaveBeenCalledWith("global", [emote("abc", "Pog")]);
    expect(store.getEmote("Pog")).toEqual({
      id: "abc",
      code: "Pog",
      type: "7tv",
      link: SEVENTV_CDN("abc", "webp"),
      animated: false,
      ownerName: "oda",
    });
  });

  it("caches channel emotes under a channel-scoped key", async () => {
    const cache = new InMemoryEmoteCache();
    globalThis.fetch = jest.fn(() =>
      okResponse(channelPayload([emote("ch1", "Chan")])),
    ) as unknown as typeof fetch;

    const store = new DefaultEmotesStore({ cache });
    await store.load("12345");

    expect(cache.write).toHaveBeenCalledWith("channel:12345", [
      emote("ch1", "Chan"),
    ]);
    expect(store.getEmote("Chan")).toBeDefined();
  });

  it("uses the saved response when the request fails", async () => {
    const cache = new InMemoryEmoteCache();
    const saved = [emote("cached", "Keep")];
    cache.seed("global", saved);
    globalThis.fetch = jest.fn(() =>
      Promise.reject(new Error("offline")),
    ) as unknown as typeof fetch;

    const onEmotesLoaded = jest.fn();
    const store = new DefaultEmotesStore({ cache, onEmotesLoaded });
    await store.load();

    expect(cache.read).toHaveBeenCalledWith("global");
    expect(store.getEmote("Keep")).toBeDefined();
    expect(onEmotesLoaded).toHaveBeenCalledWith([SEVENTV_CDN("cached", "webp")]);
  });

  it("uses the saved response when the API responds with an error status", async () => {
    const cache = new InMemoryEmoteCache();
    cache.seed("global", [emote("cached", "Keep")]);
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 503, statusText: "Unavailable" }),
    ) as unknown as typeof fetch;

    const store = new DefaultEmotesStore({ cache });
    await store.load();

    expect(store.getEmote("Keep")).toBeDefined();
  });

  it("keeps existing state when the request fails with nothing cached", async () => {
    const cache = new InMemoryEmoteCache();
    globalThis.fetch = jest.fn(() =>
      Promise.reject(new Error("offline")),
    ) as unknown as typeof fetch;

    const store = new DefaultEmotesStore({ cache });
    await expect(store.load()).resolves.toBeUndefined();

    expect(cache.read).toHaveBeenCalledWith("global");
    expect(store.emotes).toEqual({});
  });

  it("stops loading after a failed request", async () => {
    const cache = new InMemoryEmoteCache();
    globalThis.fetch = jest.fn(() =>
      Promise.reject(new Error("offline")),
    ) as unknown as typeof fetch;

    const store = new DefaultEmotesStore({ cache });
    await store.load();

    expect(store.loading).toBe(false);
  });
});
