import { makeAutoObservable } from "mobx";
import {
  Element,
  ElementContainer,
  ElementData,
} from "../../components/Element/Element";
import { ElementFactory } from "../../components/Element/ElementFactory";
import { StateMachine } from "../../components/Element/StateMachine/StateMachine";
import { log } from "../../logging";
import {
  Trigger,
  TriggerCause,
} from "../../stores/triggers/AlertTriggerInterface";
import { TriggersStore } from "../../stores/triggers/TriggersStore";
import { Preset } from "../../types/Preset";
import { ElementsProperty } from "../../components/Element/ElementsProperty";

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

interface Scope {
  start: number;
  end: number;
}

export class TwitchAlert implements ElementContainer {
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

  private elementScope(
    elements: ElementData<any>[],
    index: number,
  ): Scope | null {
    if (index >= elements.length) {
      return null;
    }
    const level = elements[index].advancedLevel;
    let i = index + 1;
    for (; i < elements.length; i++) {
      if (elements[i].advancedLevel <= level) {
        break;
      }
    }
    return { start: index, end: i - 1 };
  }

  public moveDown(id: string) {
    const allElements =
      this._data.elements.sort((a, b) => a.order - b.order) ?? [];
    const index = allElements.findIndex((element) => element.id === id);
    const firstScope = this.elementScope(allElements, index);
    if (firstScope === null) {
      return;
    }
    const secondScope = this.elementScope(allElements, firstScope.end + 1);
    if (secondScope === null) {
      return;
    }
    if (
      allElements.at(firstScope.start)?.advancedLevel !==
      allElements.at(secondScope.start)?.advancedLevel
    ) {
      return;
    }
    this.swap(firstScope, secondScope);
  }

  private swap(firstScope: Scope, secondScope: Scope) {
    this._data.elements = this._data.elements.map((element) => {
      if (
        element.order >= firstScope.start &&
        element.order <= firstScope.end
      ) {
        element.order += secondScope.end - secondScope.start + 1;
        return element;
      }
      if (
        element.order >= secondScope.start &&
        element.order <= secondScope.end
      ) {
        element.order = firstScope.start + element.order - secondScope.start;
        return element;
      }
      return element;
    });
    log.debug(
      {
        firstScope,
        secondScope,
        result: this._data.elements
          .sort((a, b) => a.order - b.order)
          .map((element) => {
            return { name: element.name, order: element.order };
          }),
      },
      "moving down elements",
    );
  }

  public moveUp(id: string) {
    const allElements =
      this._data.elements.sort((a, b) => a.order - b.order) ?? [];
    const index = allElements.findIndex((element) => element.id === id);
    const firstScope = this.elementScope(allElements, index);
    if (firstScope === null) {
      return;
    }
    const level = allElements.at(firstScope.start)?.advancedLevel ?? 0;
    let targetIndex = index;
    for (let i = firstScope.start - 1; i > -1; i--) {
      if ((allElements.at(i)?.advancedLevel ?? 0) < level) {
        break;
      }
      if (allElements.at(i)?.advancedLevel === level) {
        targetIndex = i;
        break;
      }
    }
    if (targetIndex === index) {
      return;
    }
    const secondScope = this.elementScope(allElements, targetIndex);
    if (secondScope === null) {
      return;
    }
    this.swap(secondScope, firstScope);
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
    index,
  }: {
    data: ElementData<any>;
    parentId: string | null;
    index?: number;
  }) {
    data.containerId = parentId;
    if (parentId === null) {
      data.order = index !== undefined ? index : this._data.elements.length;
      data.level = 0;
      data.advancedLevel = 0;
      this.insert(data);
    } else {
      const parent = this._data.elements.find(
        (element) => element.id === parentId,
      );
      data.level = data.level + (data.advanced ? 0 : 1);
      data.advancedLevel = (parent?.advancedLevel ?? -1) + 1;
      if (index) {
        data.order = index;
      } else {
        data.order =
          (parent?.order ?? 0) +
          this._data.elements.filter(
            (element) => element.containerId === parentId,
          ).length +
          1;
      }
      this.insert(data);
    }
  }

  private insert(data: ElementData<any>) {
    const updated = this._data.elements.map((element) => {
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
      .filter((element) => element.id !== id)
      .map((element) => {
        if (element.order > orderOfDeletedElement) {
          element.order--;
        }
        if (element.containerId === id) {
          element.containerId = null;
          element.advancedLevel--;
        }
        return element;
      });
  }

  public delete() {
    this._container.deleteAlert({ id: this._data.id });
  }
  public copy() {
    this._container.copyAlert({ id: this._data.id });
  }

  public apply(preset: Preset) {
    log.debug({ preset: preset }, "applying preset");
    const elements = preset.properties.find(
      (property) => property.name === "elements",
    ) as ElementsProperty;
    this.data.elements = elements.value;
  }
}
