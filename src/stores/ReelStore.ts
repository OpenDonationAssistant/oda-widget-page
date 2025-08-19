import { makeAutoObservable } from "mobx";
import { subscribe } from "../socket";
import { log } from "../logging";
import { ReelWidgetSettings } from "../pages/Reel/ReelWidgetSettings";
import { getRndInteger } from "../utils";

export interface RouletteItem {
  id: string;
  name: string;
  weight: number;
}

export interface ReelStore {
  selection: string | null;
  options: string[];
}

export class DefaultReelStore implements ReelStore {
  private _selection: string[] = [];
  private _options: string[] = [];
  private _settings: ReelWidgetSettings;

  constructor({
    widgetId,
    conf,
    settings,
  }: {
    widgetId: string;
    conf: any;
    settings: ReelWidgetSettings;
  }) {
    this._settings = settings;
    makeAutoObservable(this);
    this.shuffle();
    this.listen(widgetId, conf.topic.reel);
  }

  private handleSelection() {
    const time = this._settings.timeProperty.value * 1000;
    setTimeout(() => {
      log.debug(`clear active and highlight`);
      this.clearSelection();
    }, time + 20000);
  }

  private listen(widgetId: string, topic: string) {
    subscribe(widgetId, topic, (message) => {
      log.info({ message: message }, "Received reel command");
      let json = JSON.parse(message.body);
      if (json.widgetId === widgetId) {
        this._selection = [this._selection, json.selection];
      }
      this.handleSelection();
      message.ack();
    });
  }

  private shuffle() {
    let options = structuredClone(this._settings.optionListProperty.value);
    let shuffled = [];
    const count = options.length;
    for (let i = 0; i < count; i++) {
      const index = getRndInteger(0, options.length);
      shuffled.push(options[index]);
      options.splice(index, 1);
    }
    options = shuffled;
    this._options = options;
  }

  public get selection(): string | null {
    return this._selection.at(0) ?? null;
  }

  public get options(): string[] {
    return this._options;
  }

  private clearSelection(): void {
    if (this._selection.length > 0) {
      this._selection.splice(this._selection.length - 1, 1);
    }
  }
}

export class DemoReelStore implements ReelStore {
  private _options = [
    "option 1",
    "option 2",
    "option 3",
    "option 4",
    "option 5",
  ];
  private _selection: string | null = null;

  constructor(timeToSpin: number, options: RouletteItem[]) {
    makeAutoObservable(this);
    log.debug({ timeToSpin: timeToSpin }, "configuring demo reel");
    const generateSelection = () => {
      log.debug("generating selection");
      this._selection =
        this._options[getRndInteger(0, this._options.length - 1)];
      setTimeout(() => {
        log.debug("clearing selection");
        this._selection = null;
      }, timeToSpin);
    };
    generateSelection();
    setInterval(() => generateSelection(), timeToSpin + 20000 + 3000);
  }

  public get options(): string[] {
    return this._options;
  }

  public get selection(): string | null {
    return this._selection;
  }
}
