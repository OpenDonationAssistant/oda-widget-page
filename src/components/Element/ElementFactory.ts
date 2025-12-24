import { ContainerElement } from "./ContainerElement/ContainerElement";
import { Element, ElementContainer, ElementData } from "./Element";
import { LabelElement } from "./LabelElement/LabelElement";
import { MediaElement } from "./MediaElement/MediaElement";

export class ElementFactory {
  public static fromData(
    container: ElementContainer,
    data: ElementData<any>,
  ): Element<any> {
    if (data.type === "label") {
      return new LabelElement(data, container);
    }
    if (data.type === "media") {
      return new MediaElement(data, container);
    }
    if (data.type === "container") {
      return new ContainerElement(data, container);
    }
    return new Element(data, container);
  }
}
