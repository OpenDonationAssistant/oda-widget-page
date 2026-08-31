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

export interface MessagePart {
  type: "string" | "emote";
  text?: string;
  url?: string;
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
      console.log(data);
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
    console.log({ item }, "chat event received");
    let emotes = item.get("emotes");
    const text: string = item.get("message_text");
    let lastIndex = 0;
    emotes =
      emotes?.map((it: any) => {
        const index = text.indexOf(it.name, lastIndex);
        lastIndex = index + 1;
        return { ...it, ...{ start: index, end: index + it.name.length } };
      }) ?? [];
    let index = 0;
    const parts: MessagePart[] = [];
    emotes.forEach((emote: any) => {
      parts.push({ type: "string", text: text.slice(index, emote.start) });
      parts.push({
        type: "emote",
        text: emote.name,
        url: emote.urls?.["1"],
      });
      index = emote.end;
    });
    parts.push({ type: "string", text: text.slice(index) });
    let badgets = item.get("badges");
    badgets =
      badgets?.map((it: any) => {
        return {
          name: it.name,
          url: it.url,
        };
      }) ?? [];
    if (item.type === "KICK_CHAT_MESSAGE") {
      badgets = [
        {
          name: "KICK",
          url: "https://kick.com/favicon.ico?favicon.1782phf7eyk2q.ico=",
        },
        ...badgets,
      ];
    }
    if (item.type === "VKLIVE_CHAT_MESSAGE") {
      badgets = [
        {
          name: "VKLIVE",
          url: "https://dev.live.vkvideo.ru/static/favicon.png",
        },
        ...badgets,
      ];
    }
    if (item.type === "TWITCH_CHAT_MESSAGE") {
      badgets = [
        {
          name: "TWITCH",
          url: "https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png",
        },
        ...badgets,
      ];
    }
    const message = {
      badges: badgets,
      chatter: {
        nickname: item.get("chatter_user_login"),
        color: item.get("chatter_color"),
      },
      parts,
    };
    this._messages.push(message);

    console.log({ message }, "adding message");

    while (this._messages.length > this._size) {
      this._messages.shift();
    }
  }

  public get messages() {
    return this._messages;
  }
}
