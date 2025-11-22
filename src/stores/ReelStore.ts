import { makeAutoObservable, toJS } from "mobx";
import { subscribe } from "../socket";
import { log } from "../logging";
import { ReelWidgetSettings } from "../pages/Reel/ReelWidgetSettings";
import { getRndInteger } from "../utils";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyValue,
} from "../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { ColorPropertyValue, DEFAULT_COLOR_PROPERTY_VALUE } from "../components/ConfigurationPage/widgetproperties/ColorProperty";

export interface RouletteItemData {
  id: string;
  name: string;
  weight: number;
  backgroundColor: ColorPropertyValue;
  backgroundImage: ImagePropertyValue;
}

export class RouletteItem {
  constructor(
    public data: RouletteItemData,
    private owner: {
      items: RouletteItem[];
      deleteRouletteItem(id: string): void;
    },
  ) {}

  public get probability() {
    const total = this.owner.items
      .map((item) => item.data.weight)
      .reduce((acc, item) => {
        return acc + item;
      });

    return (this.data.weight / total) * 100;
  }

  public delete() {
    this.owner.deleteRouletteItem(this.data.id);
  }
}

export interface ReelStore {
  selection: string | null;
  options: string[];
  items: RouletteItem[];
  deleteRouletteItem(id: string): void;
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

  public get items(): RouletteItem[] {
    return this._options.map((option) => {
      return new RouletteItem(
        {
          id: option,
          name: option,
          weight: 1,
          backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
          backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
        },
        this,
      );
    });
  }

  deleteRouletteItem(id: string): void {
    this._options = this._options.filter((option) => option !== id);
  }

  private handleSelection() {
    const time = this._settings.timeProperty.value * 1000;
    setTimeout(() => {
      log.debug(`clear active and highlight`);
      this.clearSelection();
    }, time + 10000);
  }

  private listen(widgetId: string, topic: string) {
    subscribe(widgetId, topic, (message) => {
      let json = JSON.parse(message.body);
      log.info({ message: json, widgetId: widgetId }, "Received reel command");
      if (json.widgetId === widgetId) {
        this._selection = [...this._selection, json.selection];
      }
      this.handleSelection();
      message.ack();
    });
  }

  private shuffle() {
    let options = structuredClone(
      toJS(this._settings.optionListProperty.value),
    );
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
      log.debug("clearing reel");
      this._selection = this._selection.filter((item, index) => {
        return index !== 0;
      });
      log.debug({ selection: this._selection }, "updated reel selection");
    }
  }
}

export class DemoReelStore implements ReelStore {
  private _data: RouletteItemData[] = [];
  private _selection: string | null = null;

  constructor(timeToSpin: number, options: RouletteItemData[]) {
    makeAutoObservable(this);
    this._data = options;
    log.debug({ timeToSpin: timeToSpin }, "configuring demo reel");
    const generateSelection = () => {
      log.debug("generating selection");
      this._selection = this._data[getRndInteger(0, this._data.length - 1)].id;
      setTimeout(() => {
        log.debug("clearing selection");
        this._selection = null;
      }, timeToSpin);
    };
    generateSelection();
    setInterval(() => generateSelection(), timeToSpin + 20000 + 3000);
  }

  public get items(): RouletteItem[] {
    return this._data.map((option) => {
      return new RouletteItem(
        {
          id: option.id,
          name: option.name,
          weight: 1,
          backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
          backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
        },
        this,
      );
    });
  }

  deleteRouletteItem(id: string): void {
    this._data = this._data.filter((option) => option.id !== id);
  }

  public get options(): string[] {
    return this._data.map((option) => option.id);
  }

  public get selection(): string | null {
    return this._selection;
  }
}
