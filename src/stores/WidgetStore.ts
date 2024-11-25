import { DefaultApiFactory } from "@opendonationassistant/oda-widget-service-client";
import { Widget } from "../types/Widget";
import { makeAutoObservable } from "mobx";
import { log } from "../logging";

export class WidgetStore {
  public list: Widget[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_WIDGET_API_ENDPOINT,
    );
  }

  public async load(): Promise<void> {
    const response = await this.client().list();
    this.list = response.data
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
  }

  async addWidget(type: string): Promise<void> {
    const response = await this.client().add({
      type: type,
      sortOrder: this.list.length,
    });
    log.debug({ response: response.data }, "add widget response");
    this.list.push(Widget.fromJson(response.data, this)!);
  }

  async deleteWidget(id: string): Promise<void> {
    this.list = this.list.filter((widget) => widget.id !== id);
    await this.client()._delete(id);
  }
}
