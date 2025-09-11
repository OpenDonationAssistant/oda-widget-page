import { uuidv7 } from "uuidv7";
import { DEFAULT_PROPERTIES } from "./DefaultProperties";
import { ReactNode } from "react";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { InputNumber } from "antd";
import { makeAutoObservable, toJS } from "mobx";
import { log } from "../../../../logging";
import { produce } from "immer";
import { WidgetProperty } from "../../widgetproperties/WidgetProperty";

export interface Amount {
  major: number;
  currency: string;
}

export interface DonationEvent {
  id: string;
  amount: Amount;
}

export interface Trigger {
  type: string;
  isTriggered(event: DonationEvent): boolean;
  markup(): ReactNode;
}

export class UnknownTrigger implements Trigger {
  type = "never";

  isTriggered(event: DonationEvent): boolean {
    return false;
  }

  public markup(): ReactNode {
    return (
      <LabeledContainer displayName="widget-alert-amount">
        <InputNumber addonAfter="руб." />
      </LabeledContainer>
    );
  }
}

export class FixedDonationAmountTrigger implements Trigger {
  type = "fixed-donation-amount";
  amount = 0;

  constructor({ amount }: { amount: number }) {
    this.amount = amount;
  }

  isTriggered(event: DonationEvent): boolean {
    return event.amount.major == this.amount;
  }

  public markup(): ReactNode {
    return (
      <LabeledContainer displayName="widget-alert-amount">
        <InputNumber addonAfter="руб." />
      </LabeledContainer>
    );
  }
}

export class RangeDonationAmountTrigger implements Trigger {
  type = "at-least-donation-amount";
  min: number | null = null;
  max: number | null = null;

  constructor({ min, max }: { min: number | null; max: number | null }) {
    this.min = min;
    this.max = max;
  }

  isTriggered(event: DonationEvent): boolean {
    if (this.min && this.max) {
      return event.amount.major >= this.min && event.amount.major < this.max;
    }
    if (this.min) {
      return event.amount.major >= this.min;
    }
    if (this.max) {
      return event.amount.major < this.max;
    }
    return false;
  }

  public markup(): ReactNode {
    return (
      <LabeledContainer displayName="widget-alert-amount">
        <InputNumber addonAfter="руб." />
      </LabeledContainer>
    );
  }
}

const DEFAULT_TRIGGER: Trigger = new UnknownTrigger();

export class Alert {
  private _id: string;
  private _audio: string | null = null;
  private _image: string | null = null;
  private _video: string | null = null;
  private _triggers: Trigger[] = [DEFAULT_TRIGGER];
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
    this.triggers = triggers || [DEFAULT_TRIGGER];
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
      triggers: toJS(this._triggers),
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
      triggers: produce(toJS(this._triggers), (draft) => draft),
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

  public canBeFiredBy(event: DonationEvent): boolean {
    return this.triggers.some((trigger) => trigger.isTriggered(event));
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
    return this._triggers;
  }

  public set triggers(value: Trigger[]) {
    this._triggers = value;
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
