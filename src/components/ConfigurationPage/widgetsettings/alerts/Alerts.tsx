import { uuidv7 } from "uuidv7";
import { DEFAULT_PROPERTIES } from "./DefaultProperties";
import { makeAutoObservable, toJS } from "mobx";
import { log } from "../../../../logging";
import { produce } from "immer";
import { WidgetProperty } from "../../widgetproperties/WidgetProperty";
import {
  DonationEvent,
  Trigger,
  TriggerType,
} from "./triggers/AlertTriggerInterface";
import { TriggersStore } from "./triggers/TriggersStore";
import { LESS_THAN_DONATION_AMOUNT_TRIGGER } from "./triggers/LessThanDonationAmountTrigger";
import { FIXED_DONATION_AMOUNT_TRIGGER } from "./triggers/FixedDonationAmountTrigger";
import { RANDE_DONATION_AMOUNT_TRIGGER } from "./triggers/RangeDonationAmountTrigger";

export class Alert {
  private _id: string;
  private _audio: string | null = null;
  private _image: string | null = null;
  private _video: string | null = null;
  private _triggers: TriggersStore = new TriggersStore();
  private _properties: WidgetProperty<any>[] = DEFAULT_PROPERTIES(this);
  // TODO: use store
  private _removeFn: Function;
  private _addFn: Function;

  constructor({
    id,
    audio,
    image,
    video,
    triggers,
    properties,
    removeFn,
    addFn,
  }: {
    id?: string;
    audio?: string;
    image?: string;
    video?: string;
    triggers?: Trigger[];
    properties?: any[];
    removeFn: Function;
    addFn: Function;
  }) {
    this._id = id || uuidv7();
    this.audio = audio || null;
    this.image = image || null;
    this.video = video || null;
    triggers?.forEach((trigger) => this._triggers.addTrigger(trigger));
    this.merge(properties);
    this._removeFn = removeFn;
    this._addFn = addFn;
    makeAutoObservable(this);
  }

  public config() {
    return {
      id: this._id,
      audio: this._audio,
      image: this._image,
      video: this._video,
      triggers: toJS(this._triggers.added),
      properties: this._properties.map((it) => {
        return {
          name: it.name,
          value: it.value,
        };
      }),
    };
  }

  public property(name: string): any | null {
    return this._properties.find((it) => it.name === name)?.value;
  }

  public get(name: string): WidgetProperty<any> | null {
    return this._properties.find((it) => it.name === name) ?? null;
  }

  public copy(): Alert {
    const updated = this._properties.map((prop) => prop.copy());
    const alert = new Alert({
      id: undefined,
      audio: produce(toJS(this._audio), (draft) => draft) || undefined,
      image: produce(toJS(this._image), (draft) => draft) || undefined,
      video: produce(toJS(this._video), (draft) => draft) || undefined,
      triggers: toJS(this._triggers.added).map((trigger) =>
        this._triggers.loadTrigger(trigger),
      ),
      properties: updated,
      removeFn: this._removeFn,
      addFn: this._addFn,
    });
    log.debug(
      { added: updated, origin: toJS(this._properties) },
      "created copy properties",
    );
    this._addFn(alert);
    return alert;
  }

  public set(name: string, value: any, merge: boolean = true): void {
    this.update(name, value);
  }

  public update(name: string, value: any): void {
    this._properties.map((it) => {
      if (it.name === name) {
        it.value = value;
      }
      return it;
    });
  }

  public deleteImage(): void {
    this._image = null;
    this._video = null;
  }

  public deleteAudio(): void {
    this._audio = null;
  }

  public firedBy(event: DonationEvent): boolean {
    return this.triggers.every((trigger) => trigger.isTriggered(event));
  }

  public get id(): string | null {
    return this._id;
  }

  public get audio(): string | null {
    return this._audio;
  }

  public set audio(value: string | null) {
    this._audio = value;
  }

  public get image(): string | null {
    return this._image;
  }

  public set image(value: string | null) {
    this._image = value;
  }

  public get video(): string | null {
    return this._video;
  }

  public set video(value: string | null) {
    this._video = value;
  }

  public get triggers(): Trigger[] {
    return this._triggers.added;
  }

  public compareTriggers(alert: Alert): number {
    let result = 0;
    result = this.compareSelectedTriggers(alert, FIXED_DONATION_AMOUNT_TRIGGER);
    if (result !== 0) {
      return result;
    }
    result = this.compareSelectedTriggers(alert, RANDE_DONATION_AMOUNT_TRIGGER);
    if (result !== 0) {
      return result;
    }
    result = this.compareSelectedTriggers(
      alert,
      LESS_THAN_DONATION_AMOUNT_TRIGGER,
    );
    if (result !== 0) {
      return result;
    }
    return result;
  }

  private compareSelectedTriggers(alert: Alert, type: TriggerType) {
    let ourTriggers = this._triggers.added.filter(
      (trigger) => trigger.type === type.type,
    );
    let theirTriggers = alert.triggers.filter(
      (trigger) => trigger.type === type.type,
    );
    if (ourTriggers.length === 0 && theirTriggers.length === 0) {
      return 0;
    }
    if (ourTriggers.length === 0) {
      return -1;
    }
    if (theirTriggers.length === 0) {
      return 1;
    }
    ourTriggers = ourTriggers.sort((a, b) => {
      return a.compare(b);
    });
    theirTriggers = theirTriggers.sort((a, b) => {
      return a.compare(b);
    });
    return ourTriggers[ourTriggers.length - 1].compare(
      theirTriggers[theirTriggers.length - 1],
    );
  }

  public get triggersStore(): TriggersStore {
    return this._triggers;
  }

  public set triggers(value: Trigger[]) {
    const triggers = new TriggersStore();
    value.forEach((trigger) => triggers.addTrigger(trigger));
    this._triggers = triggers;
  }

  public get properties(): WidgetProperty<any>[] {
    return this._properties;
  }

  public set properties(value: any[]) {
    this._properties = value;
  }

  public delete() {
    this._removeFn(this._id);
  }

  private merge(properties?: any[]): void {
    const props = new Map<string, any>();
    properties?.forEach((it) => {
      props.set(it.name, it.value);
    });
    log.debug({ props: props, this: this._properties }, "merging properties");
    this._properties.forEach((it) => {
      const updatedValue = props.get(it.name);
      if (updatedValue !== undefined && updatedValue !== null) {
        it.value = updatedValue;
      }
    });
  }
}
