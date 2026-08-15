import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { createContext } from "react";

export type EmoteType = "twitch" | "bttv" | "ffz" | "7tv" | null;

SEVENTV_URL: "https://7tv.io/v3/gql";
SEVENTV_QUERY: `
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
SEVENTTV_CHANNEL_QUERY: `
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
SEVENTV_CDN: (id, format, size = 1, forceStatic = false) =>
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

export class DefaultEmotesStore implements EmotesStore {
  private _emotes: Record<string, EmoteItem> = {};
  private _loading = false;

  constructor(options?: EmotesStoreOptions) {
    makeAutoObservable(this);
  }

  public load(channelId: string): void {
    this._loading = true;
    // const fetcher = new EmoteFetcher({
    //   twitchAppID: this.twitchAppID,
    //   twitchAppSecret: this.twitchAppSecret,
    //   twitchThemeMode: "dark",
    // });

    // const channel = channelId ? Number(channelId) : undefined;
    // const tasks: Promise<unknown>[] = [
    //   fetcher
    //     .fetchTwitchEmotes()
    //     .catch((error) => log.error("Failed to fetch Twitch emotes", error)),
    //   fetcher
    //     .fetchBTTVEmotes()
    //     .catch((error) => log.error("Failed to fetch BetterTV emotes", error)),
    //   fetcher
    //     .fetchSevenTVEmotes()
    //     .catch((error) => log.error("Failed to fetch 7TV emotes", error)),
    // ];

    // if (channel) {
    //   tasks.push(
    //     fetcher
    //       .fetchTwitchEmotes(channel)
    //       .catch((error) =>
    //         log.error("Failed to fetch Twitch channel emotes", error),
    //       ),
    //     fetcher
    //       .fetchBTTVEmotes(channel)
    //       .catch((error) =>
    //         log.error("Failed to fetch BetterTV channel emotes", error),
    //       ),
    //     fetcher
    //       .fetchSevenTVEmotes(channel)
    //       .catch((error) =>
    //         log.error("Failed to fetch 7TV channel emotes", error),
    //       ),
    //   );
    // }

    // Promise.all(tasks)
    //   .then(() => {
    //     const emotes: Record<string, EmoteItem> = {};
    //     for (const emote of fetcher.emotes.values()) {
    //       const item = this.toItem(emote);
    //       emotes[item.code] = item;
    //     }
    //     this._emotes = emotes;
    //     log.debug({ count: Object.keys(this._emotes).length }, "loaded emotes");
    //   })
    //   .catch((error) => {
    //     log.error("Failed to load emotes", error);
    //   })
    //   .finally(() => {
    //     this._loading = false;
    //   });
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
