import { makeAutoObservable } from "mobx";
import {
  Amount,
  Attachment,
  DefaultApiFactory as HistoryService,
  ReelResult,
  TargetGoal,
} from "@opendonationassistant/oda-history-service-client";
import { log } from "../../logging";
import { createContext } from "react";
import { subscribe } from "../../socket";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  hour: "numeric",
  minute: "numeric",
});

export interface HistoryItem {
  originId: string;
  amount: Amount;
  nickname: string;
  system: string;
  goals: TargetGoal[];
  rouletteResults: ReelResult[];
  message: string;
  attachments: Attachment[];
  timestamp: Date;
  date: string;
  time: string;
  active: boolean;
}

export interface HistoryStore {
  today: string;
  load(): void;
  next(): void;
  pageSize: number;
  pageNumber: number;
  items: HistoryItem[];
  isRefreshing: boolean;
  showODA: boolean;
  showDonationAlerts: boolean;
  showDonatePay: boolean;
  showDonatePayEu: boolean;
  showDonateStream: boolean;
}

export class DefaultHistoryStore implements HistoryStore {
  private _recipientId: string;
  private _pageSize: number;
  private _pageNumber: number;
  private _amount: number;
  private _refreshing: boolean;
  private _list: HistoryItem[];
  private _showODA: boolean;
  private _showDonationAlerts: boolean;
  private _showDonatePay: boolean;
  private _showDonatePayEu: boolean;
  private _showDonateStream: boolean;
  private _widgetId: string;
  private _active: string | null = null;

  // todo type for conf
  constructor(recipientId: string, widgetId: string, conf: any) {
    log.debug("new history store");
    this._recipientId = recipientId;
    this._widgetId = widgetId;
    this._pageNumber = 0;
    this._pageSize = 10;
    this._amount = 0;
    this._refreshing = false;
    this._list = [];
    this._showODA = this.readValue(`${widgetId}.showODA`);
    this._showDonationAlerts = this.readValue(`${widgetId}.showDonationAlerts`);
    this._showDonatePay = this.readValue(`${widgetId}.showDonatePay`);
    this._showDonatePayEu = this.readValue(`${widgetId}.showDonatePayEu`);
    this._showDonateStream = this.readValue(`${widgetId}.showDonateStream`);
    this.load();
    makeAutoObservable(this);
    this.listen(conf);
  }

  private readValue(key: string) {
    const value = localStorage.getItem(key);
    if (value === undefined || value === null) {
      return true;
    }
    return JSON.parse(value);
  }

  private listen(conf: any) {
    log.debug("listening for history events");
    subscribe(this._widgetId, conf.topic.alerts, (message) => {
      log.debug(`events widgets received: ${message.body}`);
      setTimeout(() => {
        this._list = [];
        this._pageNumber = 0;
        this.load();
      }, 1500);
      message.ack();
    });
    subscribe(this._widgetId, conf.topic.alertStatus, (message) => {
      log.debug(`Payments widgets received: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.status === "started") {
        this._active = json.id;
        const item = this._list.find((item) => item.originId === json.id);
        log.debug({ active: this._active, item: item }, "try to search");
        if (item) {
          log.debug({ item: item }, "activate history item");
          item.active = true;
        }
      }
      if (json.status === "finished") {
        this._active = null;
        const item = this._list.find((item) => item.originId === json.id);
        log.debug({ item: item }, "try to search");
        if (item) {
          log.debug({ item: item }, "history item disactivated");
          item.active = false;
        }
      }
      log.debug(
        { active: this._active, list: this._list },
        "updated history list",
      );
      message.ack();
    });
  }

  private client() {
    return HistoryService(
      undefined,
      process.env.REACT_APP_HISTORY_API_ENDPOINT,
    );
  }

  public get today() {
    return dateTimeFormat.format(new Date());
  }

  private reset() {
    this._list = [];
    this._pageNumber = 0;
    this.load();
  }

  public load() {
    this._refreshing = true;
    log.debug(
      {
        index: this._pageNumber,
        active: this._active,
        size: this._pageSize,
        total: this._amount,
      },
      "loading history",
    );
    const systems = [];
    if (this._showODA) {
      systems.push("ODA");
    }
    if (this._showDonationAlerts) {
      systems.push("DonationAlerts");
    }
    if (this._showDonatePay) {
      systems.push("DonatePay");
    }
    if (this._showDonateStream) {
      systems.push("Donate.Stream");
    }
    this.client()
      .getHistory(
        {
          recipientId: this._recipientId,
          systems: systems,
        },
        { params: { size: this._pageSize, page: this._pageNumber } },
      )
      .then((response) => {
        this._amount = response.data.totalSize ?? 0;
        this._list = [
          ...this._list,
          ...response.data.content.map((item) => {
            return {
              originId: item.paymentId ?? "",
              amount: item.amount ?? { major: 0, minor: 0, currency: "RUB" },
              nickname: item.nickname ?? "Аноним",
              goals: item.goals ?? [],
              message: item.message ?? "",
              attachments: item.attachments ?? [],
              timestamp: item.authorizationTimestamp
                ? new Date(item.authorizationTimestamp)
                : new Date(),
              date: dateTimeFormat.format(
                item.authorizationTimestamp
                  ? new Date(item.authorizationTimestamp)
                  : new Date(),
              ),
              time: timeFormat.format(
                item.authorizationTimestamp
                  ? new Date(item.authorizationTimestamp)
                  : new Date(),
              ),
              active: item.paymentId === this._active,
              system: item.system ?? "ODA",
              rouletteResults: item.reelResults ?? [],
            };
          }),
        ];
        this._refreshing = false;
      });
  }

  public next() {
    if (this._pageNumber * this._pageSize >= this._amount) {
      return;
    }
    this._pageNumber = this._pageNumber + 1;
    this.load();
  }

  public set pageSize(size: number) {
    this._pageSize = size;
  }

  public set pageNumber(page: number) {
    this._pageNumber = page;
  }

  public get isRefreshing() {
    return this._refreshing;
  }

  public get items() {
    return this._list;
  }
  public get showODA(): boolean {
    return this._showODA;
  }
  public set showODA(value: boolean) {
    localStorage.setItem(`${this._widgetId}.showODA`, JSON.stringify(value));
    this._showODA = value;
    this.reset();
  }
  public get showDonationAlerts(): boolean {
    return this._showDonationAlerts;
  }
  public set showDonationAlerts(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showDonationAlerts`,
      JSON.stringify(value),
    );
    this._showDonationAlerts = value;
    this.reset();
  }
  public get showDonatePay(): boolean {
    return this._showDonatePay;
  }
  public get showDonatePayEu(): boolean {
    return this._showDonatePayEu;
  }
  public set showDonatePay(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showDonatePay`,
      JSON.stringify(value),
    );
    this._showDonatePay = value;
    this.reset();
  }
  public set showDonatePayEu(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showDonatePayEu`,
      JSON.stringify(value),
    );
    this._showDonatePayEu = value;
    this.reset();
  }
  public get showDonateStream() {
    return this._showDonateStream;
  }
  public set showDonateStream(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showDonateStream`,
      JSON.stringify(value),
    );
    this._showDonateStream = value;
    this.reset();
  }
}

export const HistoryStoreContext = createContext<HistoryStore | null>(null);
