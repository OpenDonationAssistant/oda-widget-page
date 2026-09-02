import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { subscribe } from "../../socket";
import { makeAutoObservable } from "mobx";

export interface DonationTimerTopics {
  alerts: string;
}

export interface AbstractDonationTimerStore {
  lastDonationTime: number | null;
  updateDonationTime: () => void;
}

export class DonationTimerStore implements AbstractDonationTimerStore {
  private _lastDonationTime: number | null = null;
  private _settings: DonationTimerWidgetSettings;

  constructor({
    widgetId,
    settings,
    topics,
  }: {
    widgetId: string;
    settings: DonationTimerWidgetSettings;
    topics: DonationTimerTopics;
  }) {
    this._settings = settings;
    subscribe(widgetId, topics.alerts, (message) => {
      this.updateDonationTime();
      message.ack();
    });
    makeAutoObservable(this);
  }

  updateDonationTime() {
    if (this._settings.resetOnLoad) {
      this._lastDonationTime = Date.now();
      return;
    }
  }

  public get lastDonationTime() {
    return this._lastDonationTime;
  }
}
