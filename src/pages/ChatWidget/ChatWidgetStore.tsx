import { makeAutoObservable } from "mobx";
import { Event } from "../../bus/EventBus";

export interface ChatWidgetStore {
  messages: Message[];
}

export interface Message {
  badges: Badge[];
  nickname: string;
  parts: MessagePart[];
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
      nickname: "username",
      badges: [],
      parts: [
        {
          type: "string",
          text: "first message",
        },
      ],
    },
    {
      nickname: "username",
      badges: [],
      parts: [
        {
          type: "string",
          text: "a long long long message",
        },
      ],
    },
    {
      nickname: "username",
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
    navigator.serviceWorker.addEventListener("message", (message) => {
      console.log(message);
      const data = message.data;
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
    emotes = emotes.map((it: any) => {
      const index = text.indexOf(it.name, lastIndex);
      lastIndex = index + 1;
      return { ...it, ...{ start: index, end: index + it.name.length } };
    });
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
    const badgets = item.get("badges");
    const message = {
      badges: badgets.map((it: any) => {
        return {
          name: it.name,
          url: it.url,
        };
      }),
      nickname: item.get("chatter_user_login"),
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
