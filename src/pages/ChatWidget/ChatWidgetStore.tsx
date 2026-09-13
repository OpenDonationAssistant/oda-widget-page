import { makeAutoObservable } from "mobx";
import { Event } from "../../bus/EventBus";
import { onWorkerMessage } from "../../worker";

export interface ChatWidgetStore {
  messages: Message[];
}

export interface Message {
  badges: Badge[];
  chatter: Chatter;
  parts: MessagePart[];
}

export interface Chatter {
  nickname: string;
  color: string;
}

export interface Badge {
  name: string;
  url: string;
}

export type MessagePart = StringPart | EmotePart | UrlPart;

interface StringPart {
  type: "string";
  text: string;
}

interface EmotePart {
  type: "emote";
  text: string;
  url: string;
}

interface UrlPart {
  type: "url";
  href: string;
  domain: string;
}

const URL_REGEX = /https?:\/\/[^\s]+/gi;

const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const splitTextByUrls = (text: string): MessagePart[] => {
  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const matchIndex = match.index!;
    if (matchIndex > lastIndex) {
      parts.push({ type: "string", text: text.slice(lastIndex, matchIndex) });
    }
    parts.push({
      type: "url",
      href: match[0],
      domain: extractDomain(match[0]),
    });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "string", text: text.slice(lastIndex) });
  }

  return parts;
};

const PLATFORM_BADGES: Record<string, Badge> = {
  KICK_CHAT_MESSAGE: {
    name: "KICK",
    url: "https://kick.com/favicon.ico?favicon.1782phf7eyk2q.ico=",
  },
  VKLIVE_CHAT_MESSAGE: {
    name: "VKLIVE",
    url: "https://dev.live.vkvideo.ru/static/favicon.png",
  },
  TWITCH_CHAT_MESSAGE: {
    name: "TWITCH",
    url: "https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png",
  },
};

export function eventToMessage(event: Event): Message {
  const text: string = event.get("message_text") ?? "";
  const emotes = (event.get("emotes") ?? []).sort(
    (a: any, b: any) => a.start - b.start,
  );

  let index = 0;
  const rawParts: MessagePart[] = [];
  emotes.forEach((emote: any) => {
    rawParts.push({ type: "string", text: text.slice(index, emote.start) });
    rawParts.push({
      type: "emote",
      text: emote.name,
      url: emote.urls?.["1"],
    });
    index = emote.end;
  });
  rawParts.push({ type: "string", text: text.slice(index) });

  const parts = rawParts.flatMap((part) =>
    part.type === "string" ? splitTextByUrls(part.text) : part,
  );

  let badges =
    event.get("badges")?.map((it: any) => {
      return {
        name: it.name,
        url: it.url,
      };
    }) ?? [];

  const platformBadge = PLATFORM_BADGES[event.type];
  if (platformBadge) {
    badges = [platformBadge, ...badges];
  }

  return {
    badges,
    chatter: {
      nickname: event.get("chatter_user_login"),
      color: event.get("chatter_color"),
    },
    parts,
  };
}

export class DemoChatWidgetStore implements ChatWidgetStore {
  messages: Message[] = [
    {
      chatter: {
        nickname: "username",
        color: "#ff0000",
      },
      badges: [],
      parts: [
        {
          type: "string",
          text: "first message",
        },
      ],
    },
    {
      chatter: {
        nickname: "username2",
        color: "#00FF00",
      },
      badges: [],
      parts: [
        {
          type: "string",
          text: "a long long long message",
        },
      ],
    },
    {
      chatter: {
        nickname: "username3",
        color: "#001212",
      },
      badges: [],
      parts: [
        {
          type: "string",
          text: "message with",
        },
        {
          type: "emote",
          text: "EZ",
          url: "https://static-cdn.jtvnw.net/emoticons/v1/108/1.0",
        },
        {
          type: "string",
          text: " emote",
        },
      ],
    },
  ];
  constructor() {
    makeAutoObservable(this);
  }
}

export class DefaultChatWidgetStore implements ChatWidgetStore {
  private _messages: Message[] = [];
  private _size = 50;
  constructor({}: {}) {
    onWorkerMessage((data) => {
      if (
        data._type === "TWITCH_CHAT_MESSAGE" ||
        data._type === "VKLIVE_CHAT_MESSAGE" ||
        data._type === "KICK_CHAT_MESSAGE"
      ) {
        this.addItem(new Event(data._type, data._variables, data._timestamp));
      }
    });
    makeAutoObservable(this);
  }

  private addItem(item: Event) {
    const message = eventToMessage(item);
    this._messages.push(message);

    while (this._messages.length > this._size) {
      this._messages.shift();
    }
  }

  public get messages() {
    return this._messages;
  }
}
