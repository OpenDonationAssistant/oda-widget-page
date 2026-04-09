import { DefaultApiFactory as MaxApiFactory } from "@opendonationassistant/oda-max-service-client";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { uuidv7 } from "uuidv7";
import { Loadable } from "../components/Loading/LoadingComponent";

export class Bot {
  private _announcers: Announcer[] = [];
  private _addedAnnouncers: Announcer[] = [];
  private _deletedAnnouncers: Announcer[] = [];
  private _changed: boolean = false;

  constructor(
    public id: string,
    public type: string,
    public enabled: boolean,
    announcers: AnnouncerData[],
    private _store: BotStore,
  ) {
    this._announcers = announcers.map((it) => new Announcer(it, this));
    makeAutoObservable(this);
  }

  public createAnnouncer(): void {
    this._changed = true;
    this._addedAnnouncers.push(
      new Announcer(
        { id: uuidv7(), text: "Стрим начался!", buttons: [] },
        this,
      ),
    );
  }

  public deleteAnnouncer(announcer: Announcer): void {
    this._changed = true;
    this._deletedAnnouncers.push(announcer);
    this._announcers = this._announcers.filter((it) => it !== announcer);
  }

  public save(): void {
    this._store.saveAnnouncers(
      this.id,
      this._addedAnnouncers.map((it) => ({
        id: it.id,
        text: it.text,
        buttons: it.buttons,
      })),
      this._announcers.map((it) => ({
        id: it.id,
        text: it.text,
        buttons: it.buttons,
      })),
      this._deletedAnnouncers.map((it) => it.id),
    );
  }

  public get name(): string {
    return this.type.toUpperCase();
  }

  public get announcers(): Announcer[] {
    return [...this._announcers, ...this._addedAnnouncers];
  }

  public get changed(): boolean {
    return this._changed || this._announcers.some((it) => it.changed);
  }
}

export interface Chat {
  id: number;
  title: string;
}

export class MaxButton {
  constructor(
    private _text: string,
    private _url: string,
    private _changed: boolean = false,
  ) {
    makeAutoObservable(this);
  }

  public set text(value: string) {
    this._text = value;
    this._changed = true;
  }

  public set url(value: string) {
    this._url = value;
    this._changed = true;
  }

  public get text(): string {
    return this._text;
  }

  public get url(): string {
    return this._url;
  }

  public get changed(): boolean {
    return this._changed;
  }
}

export interface AnnouncerData {
  id: string;
  text: string;
  buttons: MaxButton[];
}

export class Announcer {
  constructor(
    private _data: AnnouncerData,
    private _bot: Bot,
    private _enabled: boolean = true,
    private _changed: boolean = false,
  ) {
    makeAutoObservable(this);
  }

  public get id(): string {
    return this._data.id;
  }

  public get text(): string {
    return this._data.text;
  }

  public set text(value: string) {
    this._data.text = value;
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
    return this._data.buttons;
  }

  public get changed(): boolean {
    return this._changed || this._data.buttons.some((it) => it.changed);
  }

  public addButton(text: string, url: string) {
    this._data.buttons.push(new MaxButton(text, url));
    this._changed = true;
  }

  public deleteButton(index: number): void {
    this._data.buttons.splice(index, 1);
    this._changed = true;
  }

  public delete(): void {
    this._bot.deleteAnnouncer(this);
  }
}

export class BotStore implements Loadable {
  private _bots: Bot[] = [];

  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  public load(): Promise<void> {
    return this.refresh();
  }

  public refresh(): Promise<void> {
    return Promise.all([
      this.client().accounts(),
      this.client().announcers(),
    ]).then(([accounts, announcers]) => {
      this._bots = accounts.data.map(
        (bot) =>
          new Bot(
            bot.id,
            "max",
            true,
            announcers.data.map((it) => ({
              id: it.id,
              text: it.text,
              buttons: it.buttons.map(
                (button) => new MaxButton(button.text, button.url),
              ),
            })),
            this,
          ),
      );
    });
  }

  public saveAnnouncers(
    botId: string,
    added: AnnouncerData[],
    updated: AnnouncerData[],
    deleted: string[],
  ) {
    this.client()
      .updateAnnouncer({
        added: added.map((it) => ({
          text: it.text,
          buttons: it.buttons.map((button) => ({
            text: button.text,
            url: button.url,
          })),
          type: "announceAndDelete",
          accountId: botId,
          trigger: "onStreamStart",
          chatId: 0,
        })),
        deleted: deleted,
        updated: updated.map((it) => ({
          id: it.id,
          text: it.text,
          buttons: it.buttons.map((button) => ({
            text: button.text,
            url: button.url,
          })),
          type: "announceAndDelete",
          accountId: botId,
          trigger: "onStreamStart",
          chatId: 0,
        })),
      })
      .then(() => this.refresh());
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
