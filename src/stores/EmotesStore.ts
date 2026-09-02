import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { createContext } from "react";

export type EmoteType = "twitch" | "bttv" | "ffz" | "7tv" | "vklive" | "kick" | null;

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
}

export interface EmotesStore {
  emotes: Record<string, EmoteItem>;
  loading: boolean;
  load(channelId: string): void;
  getEmote(code: string): EmoteItem | undefined;
}

export class DemoEmotesStore implements EmotesStore {
  emotes = {};
  loading = false;
  load = () => {};
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

interface SevenTVEmote {
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

  constructor(options?: EmotesStoreOptions) {
    makeAutoObservable(this);
  }

  public async load(channelId: string): Promise<void> {
    this._loading = true;
    try {
      const tasks: Promise<SevenTVEmote[]>[] = [this.fetchGlobalEmotes()];

      if (channelId) {
        tasks.push(this.fetchChannelEmotes(channelId));
      }

      const sources = await Promise.all(tasks);

      const emotes: Record<string, EmoteItem> = {};
      for (const emote of sources.flat()) {
        const item = this.toItem(emote);
        if (item) emotes[item.code] = item;
      }

      this._emotes = emotes;
      log.debug({ count: Object.keys(this._emotes).length }, "loaded emotes");
    } catch (error) {
      log.error("Failed to load emotes", error);
    } finally {
      this._loading = false;
    }
  }

  private async fetchGlobalEmotes(): Promise<SevenTVEmote[]> {
    const json = await sevenTVRequest(SEVENTV_QUERY, { format: [SEVENTV_FORMAT] });
    return json.data?.namedEmoteSet?.emotes ?? [];
  }

  private async fetchChannelEmotes(channelId: string): Promise<SevenTVEmote[]> {
    const json = await sevenTVRequest(SEVENTV_CHANNEL_QUERY, {
      id: channelId,
      format: [SEVENTV_FORMAT],
    });
    return (
      json.data?.userByConnection?.emote_sets?.flatMap((set) => set.emotes) ?? []
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
    return this._emotes[code];
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
