import { makeAutoObservable } from "mobx";
import { Element, ElementData } from "../../components/Element/Element";
import { TwitchAlertsProperty } from "./TwitchAlertsProperty";
import { ElementFactory } from "../../components/Element/ElementFactory";

export const TWITCH_ALERT_TRIGGERS = ["never", "follow", "subscribe", "gift"];

interface TwitchAlertTrigger {
  type: string;
}

interface TwitchAlertAudio {
  delay: number;
  volume: number;
  type: "file" | "tts";
}

export interface TwitchAlertAudioFile extends TwitchAlertAudio {
  type: "file";
  url: string;
  name: string;
}

export interface TwitchAlertAudioTTS extends TwitchAlertAudio {
  type: "tts";
  template: string;
}

export interface TwitchAlertData {
  id: string;
  name: string;
  enabled: boolean;
  elements: ElementData<any>[];
  triggers: TwitchAlertTrigger[];
  audio: (TwitchAlertAudioTTS | TwitchAlertAudioFile)[];
}

export interface TwitchAlertContainer {
  copyAlert: ({ index, id }: { index?: number; id?: string }) => void;
  deleteAlert: ({ index, id }: { index?: number; id?: string }) => void;
}

export class TwitchAlert {
  private _container: TwitchAlertContainer;
  private _data: TwitchAlertData;

  constructor(
    public data: TwitchAlertData,
    public container: TwitchAlertContainer,
  ) {
    this._data = data;
    this._container = container;
    makeAutoObservable(this);
  }

  public get elements(): Element<any>[] {
    return this._data.elements.map((element) =>
      ElementFactory.fromData(this, element)
    );
  }
  public addElement({ data }: { data: ElementData<any> }) {
    this._data.elements.push(data);
  }
  public deleteElement({ name }: { name?: string }) {
    this._data.elements = this._data.elements.filter(
      (element) => element.name !== name,
    );
  }
  public delete() {
    this._container.deleteAlert({ id: this._data.id });
  }
  public copy() {
    this._container.copyAlert({ id: this._data.id });
  }
}
