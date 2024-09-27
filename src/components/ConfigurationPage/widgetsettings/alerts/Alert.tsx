import { uuidv7 } from "uuidv7";
import { DEFAULT_PROPERTIES } from "./DefaultProperties";
import { ReactNode, createContext } from "react";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { InputNumber } from "antd";
import { makeAutoObservable } from "mobx";
import { AlertComponent } from "./AlertComponent";

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
  private _properties: any[] = DEFAULT_PROPERTIES;

  constructor({
    id,
    audio,
    image,
    video,
    triggers,
    properties,
  }: {
    id?: string;
    audio?: string;
    image?: string;
    video?: string;
    triggers?: Trigger[];
    properties?: any[];
  }) {
    this._id = id || uuidv7();
    this.audio = audio || null;
    this.image = image || null;
    this.video = video || null;
    this.triggers = triggers || [DEFAULT_TRIGGER];
    this.properties = this.mergeWithDefault(properties);
    makeAutoObservable(this);
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

  public get properties(): any[] {
    return this._properties;
  }

  public set properties(value: any[]) {
    this._properties = value;
  }

  private mergeWithDefault(properties?: any[]): any[] {
    const props = new Map<string, any>();
    properties?.forEach((it) => {
      props.set(it.name, it);
    });
    return DEFAULT_PROPERTIES.map((prop) => {
      return props.get(prop.name) ?? prop;
    });
  }

  public markup(): ReactNode {
    return (
      <AlertContext.Provider value={this}>
        <AlertComponent />
      </AlertContext.Provider>
    );
  }
}

export const AlertContext = createContext<Alert>(new Alert({}));
