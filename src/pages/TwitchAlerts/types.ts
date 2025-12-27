import { makeAutoObservable } from "mobx";
import { Element, ElementData } from "../../components/Element/Element";
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
    const index = new Map<string, Element<any>>();
    const elements = this._data.elements.map((element) => {
      const converted = ElementFactory.fromData(this, element);
      index.set(element.id, converted);
      return converted;
    });
    elements.forEach((element) => {
      if (element.data.containerId) {
        const container = index.get(element.data.containerId);
        if (container) {
          container.children.push(element);
        }
      }
    });
    return elements;
  }

  public addElement({
    data,
    parent,
  }: {
    data: ElementData<any>;
    parent: ElementData<any> | null;
  }) {
    data.containerId = parent?.id ?? null;
    this._data.elements.push(data);
  }

  public deleteElement({ id }: { id: string }) {
    this._data.elements = this._data.elements.filter(
      (element) => element.id !== id,
    );
  }

  public delete() {
    this._container.deleteAlert({ id: this._data.id });
  }
  public copy() {
    this._container.copyAlert({ id: this._data.id });
  }
}
