import { DefaultApiFactory as MaxApiFactory } from "@opendonationassistant/oda-max-service-client";
import { makeAutoObservable, reaction } from "mobx";
import { createContext } from "react";
import { uuidv7 } from "uuidv7";
import { Loadable } from "../components/Loading/LoadingComponent";

export class Bot {
  constructor(
    public id: string,
    public type: string,
    public enabled: boolean,
    private _announcers: Announcer[] = [],
    private _unsaved: boolean = false,
  ) {
    makeAutoObservable(this);
  }

  public get name(): string {
    return this.type.toUpperCase();
  }

  public get unsaved(): boolean {
    return this._unsaved;
  }

  public createAnnouncer(): void {
    this._announcers.push(new Announcer(uuidv7(), "Стрим начался!", [], true));
  }

  public get announcers(): Announcer[] {
    return this._announcers;
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

  public get buttons(): MaxButton[] {
    return this._buttons;
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

export class BotStore implements Loadable {
  private _bots: any[] = [];

  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  public load(): Promise<void> {
    return this.refresh();
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

  public refresh(): Promise<void> {
    return Promise.all([
      this.client().accounts(),
      this.client().announcers(),
    ]).then(([accounts, announcers]) => {
      this._bots = accounts.data.map((bot) => new Bot(bot.id, "max", true));
    });
  }

  public addAnnouncer(bot: Bot, chat: Chat, text: string) {
    return this.client().addAnnouncer({
      accountId: bot.id,
      chatId: Number(chat.id),
      text: text,
      buttons: [],
      trigger: "streamStart",
      type: "announceAndDelete",
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
