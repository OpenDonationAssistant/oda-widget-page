import { makeAutoObservable } from "mobx";
import { Element, ElementData } from "../../components/Element/Element";
import { ElementFactory } from "../../components/Element/ElementFactory";
import { StateMachine } from "../../components/Element/StateMachine/StateMachine";
import { log } from "../../logging";
import {
  Trigger,
  TriggerCause,
} from "../../stores/triggers/AlertTriggerInterface";
import { TriggersStore } from "../../stores/triggers/TriggersStore";

export const TWITCH_ALERT_TRIGGERS = ["never", "follow", "subscribe", "gift"];

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
  name: string;
  templates: string[];
}

export interface TwitchAlertData {
  id: string;
  name: string;
  enabled: boolean;
  elements: ElementData<any>[];
  triggers: Trigger[];
  audio: (TwitchAlertAudioTTS | TwitchAlertAudioFile)[][];
}

export interface TwitchAlertContainer {
  copyAlert: ({ index, id }: { index?: number; id?: string }) => void;
  deleteAlert: ({ index, id }: { index?: number; id?: string }) => void;
}

export class TwitchAlert {
  private _container: TwitchAlertContainer;
  private _data: TwitchAlertData;
  private _state: StateMachine = new StateMachine();
  private _triggerFactory = new TriggersStore();

  constructor(
    public data: TwitchAlertData,
    public container: TwitchAlertContainer,
  ) {
    this._data = data;
    this._container = container;
    makeAutoObservable(this);
  }

  public canBeTriggered(cause: TriggerCause): number[] {
    const priorities = this._data.triggers
      .map((trigger) => this._triggerFactory.loadTrigger(trigger))
      .map((trigger) => trigger.priorityFor(cause))
      .sort((a, b) => b - a);
    log.debug(
      { priorities: priorities, alert: this._data.id },
      "calculating priorities",
    );
    if (priorities.length === 0) {
      return [];
    }
    if (priorities.at(0) === -1) {
      return [];
    }
    return priorities;
  }

  public show() {
    log.debug({ id: this._data.id, name: this._data.name }, "showing alert");
    return this._state.goTo("visible");
  }

  public hide() {
    return this._state.goTo("hidden");
  }

  public get state() {
    return this._state;
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
    parentId,
    index
  }: {
    data: ElementData<any>;
    parentId: string | null;
    index?: number;
  }) {
    data.containerId = parentId;
    if (parentId === null){
      data.order = index ? index : this._data.elements.length;
      data.level = 0;
      data.advancedLevel = 0;
      this.insert(data);
    } else {
      const parent = this._data.elements.find(
        (element) => element.id === parentId
      );
      data.level =
        data.level + (data.advanced ? 0 : 1);
      data.advancedLevel = (parent?.advancedLevel ?? -1) + 1;
      if (index){
        data.order = index;
      } else {
        data.order = (parent?.order ?? 0) + this._data.elements.filter((element) => element.containerId === parentId).length + 1;
      }
      this.insert(data);
    }
  }

  private insert(data: ElementData<any>) {
      const updated = this._data.elements
        .map((element) => {
          if (element.order >= data.order) {
            element.order++;
          }
          return element;
        });
      updated.push(data);
      this._data.elements = updated;
  }

  public deleteElement({ id }: { id: string }) {
    const index = this._data.elements.findIndex((element) => element.id === id);
    if (index === -1) {
      return;
    }
    const orderOfDeletedElement = this._data.elements[index].order;
    this._data.elements = this._data.elements
      .filter(
        (element) => element.id !== id,
      )
      .map(element => {
        if (element.order > orderOfDeletedElement) {
          element.order--;
        }
        if (element.containerId === id) {
          element.containerId = null;
          element.advancedLevel--;
        }
        return element
      })
  }

  public delete() {
    this._container.deleteAlert({ id: this._data.id });
  }
  public copy() {
    this._container.copyAlert({ id: this._data.id });
  }
}
