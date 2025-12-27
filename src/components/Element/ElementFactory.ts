import { ContainerElement } from "./ContainerElement/ContainerElement";
import { Element, ElementContainer, ElementData } from "./Element";
import { LabelElement } from "./LabelElement/LabelElement";
import { MarqueeElement } from "./MarqueeElement/MarqueeElement";
import { MediaElement } from "./MediaElement/MediaElement";
import { QRElement } from "./QRElement/QRElement";
import { SlideShowElement } from "./SlideShowElement/SlideShowElement";

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
    if (data.type === "marquee") {
      return new MarqueeElement(data, container);
    }
    if (data.type === "slideshow") {
      return new SlideShowElement(data, container);
    }
    if (data.type === "qrcode") {
      return new QRElement(data, container);
    }
    return new Element(data, container);
  }
}
