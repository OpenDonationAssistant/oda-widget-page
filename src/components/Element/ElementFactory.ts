import { Element, ElementContainer, ElementData } from "./Element";
import { LabelElement } from "./LabelElement";

export class ElementFactory {
  static create<T>(type: string): T {
    return {} as T;
  }

  public static fromData(
    container: ElementContainer,
    data: ElementData<any>,
  ): Element<any> {
    if (data.type === "label") {
      return new LabelElement(data, container);
    }
    return new Element(data, container);
  }
}
