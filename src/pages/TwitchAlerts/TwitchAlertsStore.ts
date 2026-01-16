import { makeAutoObservable } from "mobx";
import { TwitchAlertsWidgetSettings } from "./TwitchAlertsWidgetSettings";
import { TwitchAlert } from "./types";
import { sleep } from "../../utils";

export interface TwitchAlertsStore {
  alerts: TwitchAlert[];
}

export class DefaultTwitchAlertsStore implements TwitchAlertsStore {
  private _settings: TwitchAlertsWidgetSettings;

  constructor(settings: TwitchAlertsWidgetSettings) {
    this._settings = settings;
    makeAutoObservable(this);
  }

  public get alerts() {
    return this._settings.twitchAlertsProperty.alerts;
  }
}

export class DemoTwitchAlertsStore implements TwitchAlertsStore {
  private _alert: TwitchAlert;
  private _allowToRun: boolean = true;

  constructor(alert: TwitchAlert) {
    this._alert = alert;
    makeAutoObservable(this);
    this.listen();
  }

  public stop() {
    this._alert.hide();
    this._allowToRun = false;
  }

  private listen() {
    if (!this._allowToRun) return;
    sleep(1000)
      .then(() => this._alert.show())
      .then(() => sleep(3000))
      .then(() => this.listen());
  }

  public get alerts() {
    return [this._alert];
  }
}
