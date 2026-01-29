import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../ConfigurationPage/widgetproperties/WidgetProperty";
import { Element, ElementContainer, ElementData } from "./Element";
import { ElementDescription, ElementFactory } from "./ElementFactory";
import { ElementsTab } from "./ElementsTab";
import { log } from "../../logging";

interface Scope {
  start: number;
  end: number;
}

// TODO обьединить с TwitchAlert
export class ElementsProperty
  extends DefaultWidgetProperty<ElementData<any>[]>
  implements ElementContainer
{
  private _availableElements: ElementDescription[] = [];

  constructor({
    value,
    available,
  }: {
    value: ElementData<any>[];
    available: ElementDescription[];
  }) {
    super({
      name: "elements",
      value: value,
      displayName: "Элементы",
      help: undefined,
    });
    this._availableElements = available;
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
    const allElements = this.value.sort((a, b) => a.order - b.order) ?? [];
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
    this.value = this.value.map((element) => {
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
        result: this.value
          .sort((a, b) => a.order - b.order)
          .map((element) => {
            return { name: element.name, order: element.order };
          }),
      },
      "moving down elements",
    );
  }

  public moveUp(id: string) {
    const allElements = this.value.sort((a, b) => a.order - b.order) ?? [];
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
      data.order = index !== undefined ? index : this.value.length;
      data.level = 0;
      data.advancedLevel = 0;
      this.insert(data);
    } else {
      const parent = this.value.find((element) => element.id === parentId);
      data.level = data.level + (data.advanced ? 0 : 1);
      data.advancedLevel = (parent?.advancedLevel ?? -1) + 1;
      if (index) {
        data.order = index;
      } else {
        data.order =
          (parent?.order ?? 0) +
          this.value.filter((element) => element.containerId === parentId)
            .length +
          1;
      }
      this.insert(data);
    }
  }

  private insert(data: ElementData<any>) {
    const updated = this.value.map((element) => {
      if (element.order >= data.order) {
        element.order++;
      }
      return element;
    });
    updated.push(data);
    this.value = updated;
  }

  public deleteElement({ id }: { id: string }) {
    const index = this.value.findIndex((element) => element.id === id);
    if (index === -1) {
      return;
    }
    const orderOfDeletedElement = this.value[index].order;
    this.value = this.value
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

  public get elements(): Element<any>[] {
    const index = new Map<string, Element<any>>();
    const elements = this.value.map((element) => {
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

  markup(): ReactNode {
    return (
      <ElementsTab
        elements={this.elements}
        available={this._availableElements}
        alert={this}
      />
    );
  }
}
