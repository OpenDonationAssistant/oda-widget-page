import { makeAutoObservable } from "mobx";
import {
  Amount,
  HistoryItemDataTargetGoal,
  HistoryItemDataAttachment,
  HistoryItemDataReelResult,
  HistoryItemDataActionRequest,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { log } from "../../logging";
import { createContext } from "react";
import { subscribe } from "../../socket";
import { sleep } from "../../utils";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  hour: "numeric",
  minute: "numeric",
});

interface Variable {
  id: string;
  name: string;
  value: any;
  type: string;
}

function get(variables: Variable[], name: string) {
  return variables.find((it) => it.name === name)?.value;
}

export interface HistoryItem {
  id: string;
  originId: string;
  amount: Amount;
  nickname: string;
  system: string;
  event: string;
  count: number;
  levelName: string;
  goals: HistoryItemDataTargetGoal[];
  rouletteResults: HistoryItemDataReelResult[];
  message: string;
  attachments: HistoryItemDataAttachment[];
  actions: HistoryItemDataActionRequest[];
  timestamp: Date;
  date: string;
  time: string;
  active: boolean;
}

export interface HistoryStore {
  today: string;
  load(): Promise<void>;
  alert(item: HistoryItem): Promise<void>;
  export(): Promise<void>;
  loadUntil(count: number): Promise<void>;
  hasNext(): boolean;
  next(): Promise<void>;
  pageSize: number;
  pageNumber: number;
  items: HistoryItem[];
  isRefreshing: boolean;
  showODA: boolean;
  showDonationAlerts: boolean;
  showDonatePay: boolean;
  showDonatePayEu: boolean;
  showDonateStream: boolean;
  showDonateX: boolean;
  showBoostySubs: boolean;
  showBoostyFollows: boolean;
  showMemeAlertsCoins: boolean;
  after: Date | null;
  before: Date | null;
}

export interface HistoryListener {
  onHistoryItemAdded(item: HistoryItem): void;
}

function convert(message: any): HistoryItem {
  return {
    id: message.id,
    originId: get(message.variables, "originId"),
    amount: {
      major: Number(get(message.variables, "amount") ?? "0"),
      minor: 0,
      currency: "RUB",
    },
    nickname: get(message.variables, "nickname"),
    system: get(message.variables, "system"),
    event: get(message.variables, "event"),
    count: get(message.variables, "count"),
    levelName: get(message.variables, "levelName"),
    goals: [],
    rouletteResults: [],
    message: get(message.variables, "message"),
    attachments: [],
    actions: [],
    timestamp: new Date(),
    date: "",
    time: "",
    active: false,
  };
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
  private _showDonateX: boolean;
  private _showBoostySubs: boolean;
  private _showBoostyFollows: boolean;
  private _showMemeAlertsCoins: boolean;
  private _after: Date | null;
  private _before: Date | null;
  private _widgetId: string;
  private _active: string | null = null;

  private _listeners: HistoryListener[] = [];

  // todo type for conf
  constructor(recipientId: string, widgetId: string, conf: any) {
    log.debug({ widgetId: widgetId }, "new history store");
    this._recipientId = recipientId;
    this._widgetId = widgetId;
    this._pageNumber = 0;
    this._pageSize = 10;
    this._amount = -1;
    this._refreshing = false;
    this._list = [];
    this._showODA = this.readValue(`${widgetId}.showODA`);
    this._showDonationAlerts = this.readValue(`${widgetId}.showDonationAlerts`);
    this._showDonatePay = this.readValue(`${widgetId}.showDonatePay`);
    this._showDonatePayEu = this.readValue(`${widgetId}.showDonatePayEu`);
    this._showDonateStream = this.readValue(`${widgetId}.showDonateStream`);
    this._showDonateX = this.readValue(`${widgetId}.showDonateX`);
    this._showBoostySubs = this.readValue(`${widgetId}.showBoostySubs`);
    this._showBoostyFollows = this.readValue(`${widgetId}.showBoostyFollows`);
    this._showMemeAlertsCoins = this.readValue(
      `${widgetId}.showMemeAlertsCoins`,
    );
    this._after = null;
    this._before = null;
    makeAutoObservable(this);
    this.load()
      .then(() => {
        this.listen(conf);
      })
      .catch((error) => {
        log.error(error);
      });
  }

  public alert(item: HistoryItem) {
    return this.client()
      .repeatAlert({ historyItemId: item.id })
      .then((response) => {});
  }

  public export() {
    return this.client()
      .printCsv({
        after: this._after?.toISOString(),
        before: this._before?.toISOString(),
        events: this.events,
        systems: this.systems,
      })
      .then(async (response) => {
        let ready = false;
        while (!ready) {
          await sleep(1000);
          ready = (await this.client().getCsvStatus(response.data.printId)).data
            .ready;
        }
        this.client()
          .downloadCsv(response.data.printId)
          .then((response) => {
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "history.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
      });
  }

  public get after() {
    return this._after;
  }

  public get before() {
    return this._before;
  }

  public set after(after: Date | null) {
    this._after = after;
    this._list = [];
    this.load();
  }

  public set before(before: Date | null) {
    this._before = before;
    this._list = [];
    this.load();
  }

  public addListener(listener: HistoryListener) {
    this._listeners.push(listener);
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
    subscribe(
      this._widgetId,
      conf.topic.events,
      (message) => {
        log.debug(`events widgets received: ${message.body}`);
        setTimeout(() => {
          this._list = [];
          this._pageNumber = 0;
          this.load();
        }, 1500);
        this._listeners.forEach((listener) => {
          // listener.onHistoryItemAdded(JSON.parse(message.body));
        });
        message.ack();
      },
      { autoDelete: "true", durable: "false" },
    );
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
        const item = this._list.find((item) => item.active);
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

  private get systems() {
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
    if (this._showDonateX) {
      systems.push("DonateX");
    }
    if (this._showBoostySubs || this._showBoostyFollows) {
      systems.push("Boosty");
    }
    if (this._showMemeAlertsCoins) {
      systems.push("MemeAlerts");
    }
    return systems;
  }

  private get events() {
    const events = [];
    if (
      this._showODA ||
      this._showDonationAlerts ||
      this._showDonatePay ||
      this._showDonateStream ||
      this._showDonateX ||
      this._showMemeAlertsCoins
    ) {
      events.push("payment");
    }
    if (this._showBoostySubs) {
      events.push("subscription");
    }
    if (this._showBoostyFollows) {
      events.push("follow");
    }
    return events;
  }

  public load() {
    log.debug(
      {
        index: this._pageNumber,
        active: this._active,
        size: this._pageSize,
        total: this._amount,
      },
      "loading history page",
    );
    this._refreshing = true;
    return this.client()
      .getHistory(
        this._pageNumber,
        this.pageSize,
        "timestamp,desc",
        this.systems,
        this.events,
        this._after?.toISOString(),
        this._before?.toISOString(),
      )
      .then((response) => {
        this._amount = response.data.totalSize ?? 0;
        log.debug({ amount: this._amount }, "history total size");
        const newData = response.data.content
          .map((item) => {
            return {
              id: item.id ?? "",
              originId: item.originId ?? "",
              amount: item.amount ?? { major: 0, minor: 0, currency: "RUB" },
              nickname: item.nickname ?? "Аноним",
              goals: item.goals ?? [],
              message: item.message ?? "",
              attachments: item.attachments ?? [],
              actions: item.actions ?? [],
              timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
              date: dateTimeFormat.format(
                item.timestamp ? new Date(item.timestamp) : new Date(),
              ),
              time: timeFormat.format(
                item.timestamp ? new Date(item.timestamp) : new Date(),
              ),
              active: item.originId === this._active,
              system: item.system ?? "ODA",
              event: item.type ?? "payment",
              count: item.count ?? 0,
              levelName: item.levelName ?? "",
              rouletteResults: item.reelResults ?? [],
              media: null,
            };
          })
          .filter((item) => {
            return this._list.findIndex((i) => i.id === item.id) === -1;
          });
        this._list = [...this._list, ...newData];
        this._refreshing = false;
      })
      .catch((error) => {
        log.error(error);
        this._refreshing = false;
        return Promise.reject(error);
      });
  }

  // TODO подумать про кеширование, надо ли оно вобще или тупо прокидывать запрос на сервер
  // как будто бы кешировать надо потому что итемы прилетают в реальном времени в начало списка
  // но кешировать только с заданными настройками/фильтрами, меняются - все заново.
  public loadUntil(count: number): Promise<void> {
    log.debug({ count: count, len: this._list.length }, "loading until");
    if (this._list.length >= count) {
      return Promise.resolve();
    }
    return this.next().then(() => {
      log.debug(
        { count: count, len: this._list.length },
        "after loading next page",
      );
      return this.loadUntil(count);
    });
  }

  public hasNext() {
    return (
      this._amount !== -1 &&
      (this._pageNumber + 1) * this._pageSize < this._amount
    );
  }

  public next() {
    log.debug(
      {
        pageNumber: this._pageNumber,
        pageSize: this._pageSize,
        total: this._amount,
      },
      "loading next page",
    );
    if (
      this._amount !== -1 &&
      this._pageNumber * this._pageSize >= this._amount
    ) {
      return Promise.resolve();
    }
    this._pageNumber = this._pageNumber + 1;
    return this.load();
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
  public get showDonateX() {
    return this._showDonateX;
  }
  public set showDonateX(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showDonateX`,
      JSON.stringify(value),
    );
    this._showDonateX = value;
    this.reset();
  }
  public get showBoostySubs() {
    return this._showBoostySubs;
  }
  public set showBoostySubs(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showBoostySubs`,
      JSON.stringify(value),
    );
    this._showBoostySubs = value;
    this.reset();
  }
  public get showBoostyFollows() {
    return this._showBoostyFollows;
  }
  public set showBoostyFollows(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showBoostyFollows`,
      JSON.stringify(value),
    );
    this._showBoostyFollows = value;
  }
  public get showMemeAlertsCoins() {
    return this._showMemeAlertsCoins;
  }
  public set showMemeAlertsCoins(value: boolean) {
    localStorage.setItem(
      `${this._widgetId}.showMemeAlertsCoins`,
      JSON.stringify(value),
    );
    this._showMemeAlertsCoins = value;
  }
}

export const HistoryStoreContext = createContext<HistoryStore | null>(null);
