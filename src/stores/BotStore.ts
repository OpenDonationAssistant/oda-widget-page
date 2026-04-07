import { DefaultApiFactory as MaxApiFactory } from "@opendonationassistant/oda-max-service-client";
import { makeAutoObservable, reaction } from "mobx";
import { createContext } from "react";
import { uuidv7 } from "uuidv7";

export class Bot {
  constructor(
    public id: string,
    public type: string,
    public enabled: boolean,
  ) {
    makeAutoObservable(this);
  }

  public get name(): string {
    return this.type.toUpperCase();
  }

  public createAnnouncer(): Announcer {
    return new Announcer(uuidv7(), "Стрим начался!", [], true);
  }
}

export interface Chat {
  id: number;
  title: string;
}

export class MaxButton {
  constructor(
    public text: string,
    public url: string,
  ) {
    makeAutoObservable(this);
  }
}

export class Announcer {
  constructor(
    private _id: string,
    private _text: string,
    private _buttons: MaxButton[],
    private _enabled: boolean = true,
    private _changed: boolean = false,
  ) {
    makeAutoObservable(this);
  }

  public get id(): string {
    return this._id;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
    this._changed = true;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    this._changed = true;
  }

  public get changed(): boolean {
    return this._changed;
  }

  public addButton(text: string, url: string) {
    this._buttons.push(new MaxButton(text, url));
    this._changed = true;
  }

  public deleteButton(index: number): void {
    this._buttons.splice(index, 1);
    this._changed = true;
  }
}

export class BotStore {
  private _bots: any[] = [];

  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  public announcers(bot: Bot): Promise<Announcer[]> {
    return this.client()
      .announcers()
      .then((data) =>
        data.data.map(
          (item) =>
            new Announcer(
              item.id,
              item.text,
              item.buttons.map((it) => new MaxButton(it.text, it.url)),
              item.enabled,
            ),
        ),
      );
  }

  public refresh() {
    this.client()
      .accounts()
      .then(
        (data) =>
          (this._bots = data.data.map((bot) => new Bot(bot.id, "max", true))),
      );
  }

  public addAnnouncer(bot: Bot, chat: Chat, text: string) {
    return this.client().addAnnouncer({
      chatId: Number(chat.id),
      text: text,
      buttons: [],
    });
  }

  public getLink(type: string): Promise<string> {
    return this.client()
      .generateLink()
      .then((data) => data.data["link"]);
  }

  private client() {
    return MaxApiFactory(undefined, process.env.REACT_APP_MAX_API_ENDPOINT);
  }

  public removeBot(bot: Bot) {
    this.client().deleteAccount({ id: bot.id });
    this._bots = this._bots.filter((it) => it.id !== bot.id);
  }

  public chats(): Promise<Chat[]> {
    return this.client()
      .listAvailableChats()
      .then((data) => data.data.map((it) => ({ id: it.id, title: it.title })));
  }

  public get bots() {
    return this._bots;
  }
}

export const BotStoreContext = createContext<BotStore | null>(null);
