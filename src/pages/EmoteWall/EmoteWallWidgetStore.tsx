import { computed, makeObservable, observable } from "mobx";
import { uuidv7 } from "uuidv7";
import { Event } from "../../bus/EventBus";
import { onWorkerMessage } from "../../worker";
import { getRndInteger } from "../../utils";

export interface FlyingEmote {
  id: string;
  name: string;
  url: string;
  x: number;
  y: number;
}

export interface EmoteWallWidgetStore {
  emotes: FlyingEmote[];
}

export interface EmoteWallWidgetStoreOptions {
  maxConcurrentEmotes: number;
  animationDuration: number;
}

interface EmoteEntry {
  name: string;
  urls?: { "1"?: string };
}

const CHAT_MESSAGE_TYPES = [
  "TWITCH_CHAT_MESSAGE",
  "VKLIVE_CHAT_MESSAGE",
  "KICK_CHAT_MESSAGE",
] as const;

const MAX_POSITION_PERCENT = 90;
const DEMO_INTERVAL_MS = 1000;

const DEMO_EMOTES: EmoteEntry[] = [
  {
    name: "EZ",
    urls: { "1": "https://static-cdn.jtvnw.net/emoticons/v1/108/1.0" },
  },
  {
    name: "Kappa",
    urls: { "1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" },
  },
  {
    name: "PogChamp",
    urls: { "1": "https://static-cdn.jtvnw.net/emoticons/v1/30259/1.0" },
  },
  {
    name: "Keepo",
    urls: { "1": "https://static-cdn.jtvnw.net/emoticons/v1/1904/1.0" },
  },
];

const isChatMessage = (type: string): boolean =>
  CHAT_MESSAGE_TYPES.includes(type as (typeof CHAT_MESSAGE_TYPES)[number]);

const toFlyingEmote = (emote: EmoteEntry): FlyingEmote | null => {
  const url = emote.urls?.["1"];
  if (!url) return null;
  return {
    id: uuidv7(),
    name: emote.name,
    url,
    x: getRndInteger(0, MAX_POSITION_PERCENT),
    y: getRndInteger(0, MAX_POSITION_PERCENT),
  };
};

abstract class BaseEmoteWallWidgetStore implements EmoteWallWidgetStore {
  protected _emotes: FlyingEmote[] = [];
  private readonly _maxConcurrentEmotes: number;
  private readonly _animationDuration: number;
  private readonly _removalTimeouts = new Map<string, number>();

  constructor({
    maxConcurrentEmotes,
    animationDuration,
  }: EmoteWallWidgetStoreOptions) {
    this._maxConcurrentEmotes = maxConcurrentEmotes;
    this._animationDuration = animationDuration;
    makeObservable<BaseEmoteWallWidgetStore, "_emotes">(this, {
      _emotes: observable,
      emotes: computed,
    });
  }

  protected addEmote(emote: EmoteEntry) {
    const flyingEmote = toFlyingEmote(emote);
    if (!flyingEmote) return;
    this._emotes = [...this._emotes, flyingEmote];
    this.scheduleRemoval(flyingEmote.id);
    this.capEmotes();
  }

  private scheduleRemoval(id: string) {
    const timeout = window.setTimeout(() => {
      this._emotes = this._emotes.filter((emote) => emote.id !== id);
      this._removalTimeouts.delete(id);
    }, this._animationDuration);
    this._removalTimeouts.set(id, timeout);
  }

  private capEmotes() {
    if (this._emotes.length <= this._maxConcurrentEmotes) return;
    const overflow = this._emotes.length - this._maxConcurrentEmotes;
    const removed = this._emotes.slice(0, overflow);
    removed.forEach((emote) => {
      const timeout = this._removalTimeouts.get(emote.id);
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        this._removalTimeouts.delete(emote.id);
      }
    });
    this._emotes = this._emotes.slice(overflow);
  }

  public get emotes() {
    return this._emotes;
  }

  public dispose() {
    this._removalTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    this._removalTimeouts.clear();
  }
}

export class DefaultEmoteWallWidgetStore
  extends BaseEmoteWallWidgetStore
  implements EmoteWallWidgetStore
{
  private _unsubscribe?: () => void;

  constructor(options: EmoteWallWidgetStoreOptions) {
    super(options);
    this._unsubscribe = onWorkerMessage(this.onWorkerMessage);
  }

  private onWorkerMessage = (data: any) => {
    if (!isChatMessage(data?._type)) return;
    this.addEmotesFromEvent(
      new Event(data._type, data._variables, data._timestamp),
    );
  };

  private addEmotesFromEvent(event: Event) {
    const emotes = event.get("emotes");
    if (!Array.isArray(emotes)) return;
    emotes.forEach((emote: EmoteEntry) => this.addEmote(emote));
  }

  public dispose() {
    this._unsubscribe?.();
    super.dispose();
  }
}

export class DemoEmoteWallWidgetStore
  extends BaseEmoteWallWidgetStore
  implements EmoteWallWidgetStore
{
  private _timer?: number;

  constructor(options: EmoteWallWidgetStoreOptions) {
    super(options);
    this._timer = window.setInterval(
      () => this.addDemoEmote(),
      DEMO_INTERVAL_MS,
    );
  }

  private addDemoEmote() {
    const emote = DEMO_EMOTES[getRndInteger(0, DEMO_EMOTES.length)];
    this.addEmote(emote);
  }

  public dispose() {
    if (this._timer !== undefined) {
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
    super.dispose();
  }
}
