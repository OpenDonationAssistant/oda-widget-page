import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../ConfigurationPage/widgetproperties/WidgetProperty";
import { Element, ElementContainer, ElementData } from "./Element";
import { ElementDescription, ElementFactory } from "./ElementFactory";
import { ElementsTab } from "./ElementsTab";

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

  addElement({
    data,
    parentId,
  }: {
    data: ElementData<any>;
    parentId: string | null;
  }): void {
    data.containerId = parentId ?? null;
    this.value.push(data);
  }

  deleteElement({ id }: { id: string }): void {
    this.value = this.value.filter((element) => element.id !== id);
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
