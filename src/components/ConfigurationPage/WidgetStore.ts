import { DefaultApiFactory } from "@opendonationassistant/oda-widget-service-client";
import { Widget } from "../../types/Widget";
import { makeAutoObservable } from "mobx";

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
        const created = Widget.fromJson(widget);
        return created ? [created] : [];
      });
  }

  async addWidget(type: string): Promise<void> {
    this.client().add({
      type: type,
      sortOrder: this.list.length,
    })
  }
}
