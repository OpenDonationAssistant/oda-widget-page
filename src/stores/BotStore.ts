import {
  DefaultApiFactory as MaxApiFactory
} from "@opendonationassistant/oda-max-service-client";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export interface Bot {
  id: string;
  type: string;
  enabled: boolean;
}

export interface Chat {
  id: string;
  title: string;
}

export interface MaxButton{
  text: string;
  url: string;
}

export interface Announcer {
  id: string;
  text: string;
  buttons: MaxButton[];
}

export class BotStore {

  private _bots: any[] = [];

  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  public announcers(bot: Bot){
    return this.client().announcers()
      .then((data) => {
        const item = data.data.at(0);
        if (!item){
          return;
        }
        return { id: item.id, text: item.text, buttons: item.buttons.map((it) => ({ text: it.text, url: it.url })) };
      })
  }

  public refresh() {
    this.client().accounts()
      .then((data) => 
        this._bots = data.data.map(
          (bot) => ({ type: "max", enabled: true, id: bot.id })
        )
      );
  }

  public addAnnouncer(bot: Bot, chat: Chat, text: string) {
    return this.client().addAnnouncer({
      chatId: Number(chat.id),
      text: text,
      buttons: []
    });
  }

  public getLink(type: string): Promise<string> {
    return this.client().generateLink()
      .then((data) => data.data["link"]);
  }

  private client() {
    return MaxApiFactory(undefined, process.env.REACT_APP_MAX_API_ENDPOINT);
  }

  public chats(): Promise<Chat[]> {
    return this.client().listAvailableChats()
      .then((data) => 
        data.data.map(
          (it) => ({ id: it.id, title: it.title })
        )
      );
  }

  public get bots() {
    return this._bots;
  }
}

export const BotStoreContext = createContext<BotStore|null>(null);
