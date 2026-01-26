import { makeAutoObservable } from "mobx";
import { TwitchAlertsWidgetSettings } from "../../pages/TwitchAlerts/TwitchAlertsWidgetSettings";
import { TwitchAlert } from "../../pages/TwitchAlerts/types";
import { getRndInteger, sleep } from "../../utils";
import { publish, subscribe } from "../../socket";
import { log } from "../../logging";
import { VariableStore } from "../VariableStore";
import { VoiceController } from "../../logic/voice/VoiceController";
import { TriggerCause } from "../triggers/AlertTriggerInterface";
import { Variable } from "../../pages/Automation/AutomationState";

export interface AlertsStore {
  alerts: TwitchAlert[];
}

interface AlertActivation {
  alert: TwitchAlert;
  variables: Variable[];
}

export class DefaultTwitchAlertsStore implements AlertsStore {
  private _settings: TwitchAlertsWidgetSettings;
  private _conf: any;
  private _widgetId: string;
  private _queue: AlertActivation[] = [];
  private _premoderationQueue: TwitchAlert[] = [];
  private _active: AlertActivation | null = null;
  private _alerts: TwitchAlert[] = [];
  private _variables: VariableStore;
  private _voice: VoiceController;

  constructor(
    widgetId: string,
    settings: TwitchAlertsWidgetSettings,
    conf: any,
    variables: VariableStore,
  ) {
    this._widgetId = widgetId;
    this._settings = settings;
    this._conf = conf;
    this._alerts = this._settings.twitchAlertsProperty.alerts;
    makeAutoObservable(this);
    this._variables = variables;
    this._voice = new VoiceController();
    this.listen();
    this.playQueue();
  }

  private listen() {
    subscribe(this._widgetId, this._conf.topic.events, (message) => {
      let json = JSON.parse(message.body);
      switch (json.type) {
        case "TriggerAlert":
          const alertId = json.variables.find((v: any) => v.name === "alertId")
            ?.value as string;
          const alert = this._alerts.find((a) => a.data.id === alertId);
          if (alert) {
            this._queue.push({
              alert: alert,
              variables: json.variables,
            });
          }
          break;
        case "InterruptAlert":
          if (this._active) {
            this._active.alert.hide();
          }
          break;
        default:
          const cause: TriggerCause = {
            id: json.id,
            type: json.type,
          };
          const suitableAlerts = this._alerts
            .map((a) => {
              const priorities = a.canBeTriggered(cause);
              let difference = 0;
              for (const priority of priorities) {
                if (priority !== 0) {
                  difference = priority;
                  break;
                }
              }
              return {
                alert: a,
                priorities: priorities,
                matches: priorities.filter((p) => p === 0).length,
                difference: difference,
              };
            })
            .filter((a) => (a.matches > 0) || (a.difference > 0))
            .sort((a, b) => {
              const matches = b.matches - a.matches;
              if (matches !== 0) {
                return matches;
              }
              return a.difference - b.difference;
            });

          if (suitableAlerts.length === 0) {
            return;
          }
          const preferableAlerts = [];
          for (const candidate of suitableAlerts) {
            if (
              candidate.matches === suitableAlerts[0].matches &&
              candidate.difference === suitableAlerts[0].difference
            ) {
              preferableAlerts.push(candidate);
            } else {
              break;
            }
          }
          log.debug({ alerts: preferableAlerts }, "preferable alerts");
          const chosen = preferableAlerts.at(
            getRndInteger(0, preferableAlerts.length),
          );
          if (chosen) {
            this._queue.push({
              alert: chosen.alert,
              variables: json.variables,
            });
          }
          break;
      }
      message.ack();
    });
  }

  protected sendStartNotification(id: string) {
    publish(this._conf.topic.alertStatus, {
      id: id,
      status: "started",
    });
  }

  protected sendEndNotification() {
    publish(this._conf.topic.alertStatus, {
      status: "finished",
    });
  }

  private pausePlayer() {
    if (this._settings.pauseMedia) {
      publish(this._conf.topic.playerCommands, {
        command: "pause",
      });
    }
  }

  private resumePlayer() {
    if (this._settings.pauseMedia) {
      publish(this._conf.topic.playerCommands, {
        command: "resume",
      });
    }
  }

  private playQueue(): void {
    setTimeout(() => {
      if (this._queue.length > 0) {
        this._active = this._queue.shift() ?? null;
      }
      if (this._active) {
        this.pausePlayer();
        if (this._settings.premoderation) {
        }
        const localVariables = this._variables.clone();
        this._active.variables.forEach((v) => {
          localVariables.addVariable(v);
        })
        Promise.all([
          ...this._active.alert.data.audio.map((line) => this._voice.playQueue(line, localVariables)),
          ...[this._active.alert.show()],
        ])
          .then(() => {
            log.debug("all promises resolved");
            this._active?.alert.hide();
          })
          .then(() => {
            this._active = null;
            this.resumePlayer();
            this.playQueue();
          });
      } else {
        this.playQueue();
      }
    }, 3000);
  }

  public get alerts() {
    return this._alerts;
  }
}

export class DemoTwitchAlertsStore implements AlertsStore {
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
      .then(() => sleep(10000))
      .then(() => this._alert.hide())
      .then(() => sleep(3000))
      .then(() => this.listen());
  }

  public get alerts() {
    return [this._alert];
  }
}
