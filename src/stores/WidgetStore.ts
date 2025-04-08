import { DefaultApiFactory } from "@opendonationassistant/oda-widget-service-client";
import { Widget } from "../types/Widget";
import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { produce } from "immer";
import { createContext } from "react";

export interface WidgetStore {
  list: Widget[];
  addWidget(type: string): Promise<Widget | null>;
  deleteWidget(id: string): Promise<void>;
  moveWidget(originIndex: number, index: number): Promise<void>;
  search({ type }: { type?: string }): Widget[];
}

export class DefaultWidgetStore implements WidgetStore {
  private _list: Widget[] = [];

  constructor() {
    this.load();
    makeAutoObservable(this);
  }

  public get list() {
    return this._list;
  }

  public search({ type }: { type?: string }) {
    return this.list.filter((widget) => widget.type === type);
  }

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_WIDGET_API_ENDPOINT,
    );
  }

  private load(): Promise<void> {
    log.debug("loading widgets");
    return this.client()
      .list()
      .then((response) => {
        this._list = response.data
          .sort((a, b) => {
            if (a.sortOrder === undefined && b.sortOrder === undefined) {
              return 0;
            }
            if (a.sortOrder === undefined) {
              return 1;
            }
            if (b.sortOrder === undefined) {
              return -1;
            }
            return a.sortOrder - b.sortOrder;
          })
          .flatMap((widget) => {
            const created = Widget.fromJson(widget, this);
            return created ? [created] : [];
          });
      });
  }

  async addWidget(type: string): Promise<Widget | null> {
    const response = await this.client().add({
      type: type,
      sortOrder: this.list.length,
    });
    log.debug({ response: response.data }, "add widget response");
    const widget = Widget.fromJson(response.data, this);
    this.list.push(widget!);
    return widget;
  }

  async deleteWidget(id: string): Promise<void> {
    this._list = this.list.filter((widget) => widget.id !== id);
    await this.client()._delete(id);
  }

  async moveWidget(originIndex: number, index: number): Promise<void> {
    const widget = this.list.at(originIndex);
    const otherWidgets = produce(this.list, (draft) => {
      draft.splice(originIndex, 1);
      draft.splice(index, 0, widget!);
    });
    this._list = otherWidgets;
    await this.client().reorder({
      ids: this.list.map((widget) => widget.id),
    });
  }
}

export const WidgetStoreContext = createContext<WidgetStore>({
  list: [],
  addWidget: (type: string) => Promise.resolve(null),
  deleteWidget: (id: string) => Promise.resolve(),
  moveWidget: (originIndex: number, index: number) => Promise.resolve(),
  search: ({ type }: { type?: string }) => [],
});
