import axios from "axios";
import { makeAutoObservable } from "mobx";
import { subscribe } from "../../socket";
import { log } from "../../logging";
import { DefaultApiFactory as HistoryService } from "@opendonationassistant/oda-history-service-client";

const lastDonations = async (recipientId: string) => {
  const data = await HistoryService(
    undefined,
    process.env.REACT_APP_HISTORY_API_ENDPOINT,
  ).getHistory({
    recipientId: recipientId,
    pageable: {
      size: 50,
      number: 0,
      orderBy: [
        {
          property: "authorizationTimestamp",
          direction: "DESC",
          ignoreCase: true,
        },
      ],
      sort: {
        orderBy: [
          {
            property: "authorizationTimestamp",
            direction: "DESC",
            ignoreCase: true,
          },
        ],
      },
    },
  });
  return data.data.content;
};

const listDonaters = (recipientId: string, period: string) =>
  axios
    .get(
      `${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/recipients/${recipientId}/donaters?period=${period}`,
    )
    .then((response) => response.data);

export interface AbstractDonatersListStore {
  list: DonaterRecord[];
}

export interface DonaterRecord{
  nickname: string;
  amount: number;
}

export class DonatersListStore implements AbstractDonatersListStore {
  private _recipientId: string;
  private _sortedMap: Map<string, any> = new Map();
  private _list: DonaterRecord[] = [];

  constructor(
    widgetId: string,
    recipientId: string,
    period: "month" | "day",
    type: "Top" | "Last",
    topic: string,
  ) {
    this._recipientId = recipientId;
    this.listen(widgetId, topic, period, type);
    makeAutoObservable(this);
  }

  listen(
    widgetId: string,
    topic: string,
    period: "month" | "day",
    type: "Top" | "Last",
  ) {
    log.debug("create subscription");
    subscribe(widgetId, topic, (message: any) => {
      this.updateDonaters(period, type);
      message.ack();
    });
    this.updateDonaters(period, type);
  }

  updateDonaters(period: "month" | "day", type: "Top" | "Last") {
    if (type === "Last") {
      lastDonations(this._recipientId).then((data) => {
        log.debug({ updatedDonaters: data }, "updating donaters");
        this._list = data.map((donation) => {
          return {
            nickname: donation.nickname ?? "",
            amount: donation.amount?.major ?? 0,
          };
        })
      });
      return;
    }
    listDonaters(this._recipientId, period).then((data) => {
      log.debug({ updatedDonaters: data }, "updating donaters");
      const map = new Map();
      Object.keys(data)
        .filter((key) => key)
        .forEach((key) => {
          map.set(key, data[key]);
        });
      const sortedMap = new Map(
        [...map.entries()].sort((a, b) => b[1].major - a[1].major),
      );
      this._list = Array.from(sortedMap.keys())
        .map((key) => {
          return {
            nickname: key,
            amount: sortedMap.get(key)?.major ?? 0,
          };
        })
    });
  }

  public get list(): DonaterRecord[] {
    return this._list;
  }

  public get sortedMap() {
    return this._sortedMap;
  }

  private set sortedMap(sortedMap: Map<string, any>) {
    this._sortedMap = sortedMap;
  }
}
