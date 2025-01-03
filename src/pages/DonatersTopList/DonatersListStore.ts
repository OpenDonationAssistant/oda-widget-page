import axios from "axios";
import { makeAutoObservable } from "mobx";
import { subscribe } from "../../socket";
import { log } from "../../logging";

const listDonaters = (recipientId: string, period: string) =>
  axios
    .get(
      `${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/recipients/${recipientId}/donaters?period=${period}`,
    )
    .then((response) => response.data);

export interface AbstractDonatersListStore{
  sortedMap: Map<string, any>;
}

export class DonatersListStore implements AbstractDonatersListStore {
  private _recipientId: string;
  private _sortedMap: Map<string, any> = new Map();

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
      setTimeout(() => {
        this.updateDonaters(period, type);
        message.ack();
      }, 3000);
    });
    this.updateDonaters(period, type);
  }

  updateDonaters(period: "month" | "day", type: "Top" | "Last") {
    listDonaters(this._recipientId, period).then((data) => {
      log.debug({updatedDonaters: data}, "updating donaters");
      const map = new Map();
      Object.keys(data)
        .filter((key) => key)
        .forEach((key) => {
          map.set(key, data[key]);
        });
      const sortedMap =
        type === "Last"
          ? map
          : new Map([...map.entries()].sort((a, b) => b[1].major - a[1].major));
      this.sortedMap = sortedMap;
    });
  }

  public get sortedMap() {
    return this._sortedMap;
  }

  private set sortedMap(sortedMap: Map<string, any>) {
    this._sortedMap = sortedMap;
  }
}
