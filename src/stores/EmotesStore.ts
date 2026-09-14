import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { createContext } from "react";
import { EmoteResponseCache, IndexedDbEmoteCache } from "./emoteCache";

export type EmoteType =
  | "twitch"
  | "bttv"
  | "ffz"
  | "7tv"
  | "vklive"
  | "kick"
  | null;

export const SEVENTV_URL = "https://7tv.io/v3/gql";
export const SEVENTV_QUERY = `
      query GetGlobalEmotes($format: [ImageFormat!]) {
        namedEmoteSet(name: GLOBAL) {
          emotes {
            id
            name
            flags
            data {
              name
              flags
              animated
              host {
                files(formats: $format) {
                  name
                }
              }
              listed
              owner {
                display_name
              }
            }
          }
        }
      }`;
export const SEVENTV_CHANNEL_QUERY = `
      query GetChannelEmotes($id: String!, $format: [ImageFormat!]) {
        userByConnection(platform: TWITCH, id: $id) {
          emote_sets(entitled: false) {
            flags
            emotes {
              id
              name
              flags
              data {
                name
                flags
                animated
                host {
                  files(formats: $format) {
                    name
                  }
                }
                listed
                owner {
                  display_name
                }
              }
            }
          }
        }
      }`;
export const SEVENTV_CDN = (
  id: string,
  format: string,
  size = 1,
  forceStatic = false,
) =>
  `https://cdn.7tv.app/emote/${id}/${size}x${forceStatic ? "_static" : ""}.${format}`;

export interface EmoteItem {
  id: string;
  code: string;
  type: EmoteType;
  link: string;
  animated: boolean;
  ownerName: string | null;
}

export interface EmotesStoreOptions {
  twitchAppID?: string;
  twitchAppSecret?: string;
  /** Called with the loaded emote URLs after a successful load. */
  onEmotesLoaded?: (urls: string[]) => void;
  /**
   * Persistence used to save successful responses and fall back to them when a
   * later request fails. Defaults to an IndexedDB-backed cache.
   */
  cache?: EmoteResponseCache<SevenTVEmote>;
}

const GLOBAL_CACHE_KEY = "global";
const channelCacheKey = (channelId: string) => `channel:${channelId}`;

export interface EmotesStore {
  emotes: Record<string, EmoteItem>;
  loading: boolean;
  load(channelId: string): Promise<void>;
  getEmote(code: string): EmoteItem | undefined;
}

export class DemoEmotesStore implements EmotesStore {
  emotes = {};
  loading = false;
  load = async () => {};
  getEmote = () => undefined;
}

interface SevenTVFile {
  name: string;
}

interface SevenTVEmoteData {
  name?: string;
  flags?: number;
  animated?: boolean;
  host?: { files?: SevenTVFile[] };
  listed?: boolean;
  owner?: { display_name: string } | null;
}

export interface SevenTVEmote {
  id: string;
  name: string;
  flags?: number;
  data?: SevenTVEmoteData;
}

interface SevenTVEmoteSet {
  flags?: number;
  emotes: SevenTVEmote[];
}

interface SevenTVResponse {
  data?: {
    namedEmoteSet?: { emotes: SevenTVEmote[] };
    userByConnection?: { emote_sets?: SevenTVEmoteSet[] };
  };
  errors?: Array<{ message: string }>;
}

const SEVENTV_FORMAT = "WEBP";

async function sevenTVRequest(
  query: string,
  variables: Record<string, unknown>,
): Promise<SevenTVResponse> {
  const response = await fetch(SEVENTV_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    throw new Error(
      `7TV API request failed with status ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as SevenTVResponse;
}

export class DefaultEmotesStore implements EmotesStore {
  private _emotes: Record<string, EmoteItem> = {};
  private _loading = false;
  private readonly options?: EmotesStoreOptions;
  private readonly _cache: EmoteResponseCache<SevenTVEmote>;

  constructor(options?: EmotesStoreOptions) {
    makeAutoObservable<DefaultEmotesStore, "_cache">(this, { _cache: false });
    this.options = options;
    this._cache = options?.cache ?? new IndexedDbEmoteCache<SevenTVEmote>();
  }

  public async load(channelId?: string): Promise<void> {
    this._loading = true;
    const key = channelId ? channelCacheKey(channelId) : GLOBAL_CACHE_KEY;
    try {
      const source = await this.loadFromApi(key, channelId);
      if (!source) return;

      await this._cache.write(key, source);
      this.applyEmotes(source, channelId);
    } catch (error) {
      log.error({ error, channelId }, "Failed to load emotes", error);
    } finally {
      this._loading = false;
    }
  }

  /**
   * Fetches the requested emote set. When the request fails, falls back to the
   * last saved response for `key` so widgets keep rendering emotes offline.
   */
  private async loadFromApi(
    key: string,
    channelId?: string,
  ): Promise<SevenTVEmote[] | undefined> {
    try {
      return channelId
        ? await this.fetchChannelEmotes(channelId)
        : await this.fetchGlobalEmotes();
    } catch (error) {
      log.error({ error, channelId }, "Failed to load emotes from 7TV", error);
      const cached = await this._cache.read(key);
      if (cached) {
        log.warn(
          { key, count: cached.length },
          "Using cached emote response after load failure",
        );
      }
      return cached;
    }
  }

  private applyEmotes(source: SevenTVEmote[], channelId?: string): void {
    const emotes: Record<string, EmoteItem> = {};
    for (const emote of source) {
      const item = this.toItem(emote);
      if (item) {
        emotes[item.code] = item;
        this._emotes[item.code] = item;
      }
    }

    const urls = Object.values(emotes).map((emote) => emote.link);
    console.log({ channelId, urls }, "loaded emotes");
    this.options?.onEmotesLoaded?.(urls);
    log.debug(
      { count: Object.keys(this._emotes).length },
      "total loaded emotes",
    );
  }

  private async fetchGlobalEmotes(): Promise<SevenTVEmote[]> {
    const json = await sevenTVRequest(SEVENTV_QUERY, {
      format: [SEVENTV_FORMAT],
    });
    return json.data?.namedEmoteSet?.emotes ?? [];
  }

  private async fetchChannelEmotes(channelId: string): Promise<SevenTVEmote[]> {
    const json = await sevenTVRequest(SEVENTV_CHANNEL_QUERY, {
      id: channelId,
      format: [SEVENTV_FORMAT],
    });
    return (
      json.data?.userByConnection?.emote_sets?.flatMap((set) => set.emotes) ??
      []
    );
  }

  private toItem(emote: SevenTVEmote): EmoteItem | undefined {
    const file = emote.data?.host?.files?.[0];
    if (!file) return undefined;
    const format = file.name.split(".").pop() ?? "webp";
    return {
      id: emote.id,
      code: emote.name,
      type: "7tv",
      link: SEVENTV_CDN(emote.id, format),
      animated: emote.data?.animated ?? false,
      ownerName: emote.data?.owner?.display_name ?? null,
    };
  }

  public getEmote(code: string): EmoteItem | undefined {
    const found = this._emotes[code];
    console.log({ code, found }, "getEmote");
    return found;
  }

  public get emotes(): Record<string, EmoteItem> {
    return this._emotes;
  }

  public get loading(): boolean {
    return this._loading;
  }
}

export const EmotesStoreContext = createContext<EmotesStore>(
  new DemoEmotesStore(),
);
