import { AnimationsElement, DEFAULT_ANIMATIONS_ELEMENT_SETTINGS } from "./AnimationsElement/AnimationsElement";
import { ContainerElement, DEFAULT_CONTAINER_ELEMENT_SETTINGS } from "./ContainerElement/ContainerElement";
import { Element, ElementContainer, ElementData } from "./Element";
import { DEFAULT_LABEL_ELEMENT_SETTINGS, LabelElement } from "./LabelElement/LabelElement";
import { DEFAULT_MARQUEE_ELEMENT_SETTINGS, MarqueeElement } from "./MarqueeElement/MarqueeElement";
import { DEFAULT_MEDIA_ELEMENT_SETTINGS, MediaElement } from "./MediaElement/MediaElement";
import { DEFAULT_PROGRESS_ELEMENT_SETTINGS, ProgressElement } from "./ProgressElement/ProgressElement";
import { ProgressElementSvg } from "./ProgressElementSvg/ProgressElementSvg";
import { DEFAULT_PROGRESS_ELEMENT_SVG_SETTINGS } from "./ProgressElementSvg/ProgressElementSvgSettings";
import { DEFAULT_QR_ELEMENT_SETTINGS, QRElement } from "./QRElement/QRElement";
import { DEFAULT_REEL_ELEMENT_SETTINGS, ReelElement } from "./ReelElement/ReelElement";
import { DEFAULT_REPEATER_ELEMENT_SETTINGS, RepeaterElement } from "./RepeaterElement/RepeaterElement";
import { DEFAULT_SLIDESHOW_ELEMENT_SETTINGS, SlideShowElement } from "./SlideShowElement/SlideShowElement";
import { DEFAULT_TIMED_ELEMENT_SETTINGS, TimedElement } from "./TimedElement/TimedElement";
import { DEFAULT_WHEEL_ELEMENT_SETTINGS, WheelElement } from "./WheelElement/WheelElement";

export interface ElementDescription{
  type: string;
  name: string;
  advanced: boolean;
  settings: any;
}

export class ElementFactory {
  public static list(): ElementDescription[] {
    return [
      {
        type: "label",
        name: "Надпись",
        advanced: false,
        settings: DEFAULT_LABEL_ELEMENT_SETTINGS,
      },
      {
        type: "media",
        name: "Изображение/Видео",
        advanced: false,
        settings: DEFAULT_MEDIA_ELEMENT_SETTINGS,
      },
      {
        type: "container",
        name: "Контейнер",
        advanced: false,
        settings: DEFAULT_CONTAINER_ELEMENT_SETTINGS
      },
      {
        type: "marquee",
        name: "Бегущая строка",
        advanced: false,
        settings: DEFAULT_MARQUEE_ELEMENT_SETTINGS
      },
      {
        type: "slideshow",
        name: "Слайдшоу",
        advanced: false,
        settings: DEFAULT_SLIDESHOW_ELEMENT_SETTINGS
      },
      {
        type: "qrcode",
        name: "QR-код",
        advanced: false,
        settings: DEFAULT_QR_ELEMENT_SETTINGS
      },
      {
        type: "repeater",
        name: "Повторение",
        advanced: true,
        settings: DEFAULT_REPEATER_ELEMENT_SETTINGS
      },
      {
        type: "timed",
        name: "Всплывающее окно",
        advanced: false,
        settings: DEFAULT_TIMED_ELEMENT_SETTINGS
      },
      {
        type: "progress",
        name: "Прогресс",
        advanced: false,
        settings: DEFAULT_PROGRESS_ELEMENT_SETTINGS
      },
      {
        type: "progress-svg",
        name: "Прогресс(SVG)",
        advanced: false,
        settings: DEFAULT_PROGRESS_ELEMENT_SVG_SETTINGS
      },
      {
        type: "animations",
        name: "Появление/скрытиe",
        advanced: false,
        settings: DEFAULT_ANIMATIONS_ELEMENT_SETTINGS
      },
      {
        type: "wheel",
        name: "Рулетка (колесо)",
        advanced: false,
        settings: DEFAULT_WHEEL_ELEMENT_SETTINGS
      },
      {
        type: "reel",
        name: "Рулетка (лента)",
        advanced: false,
        settings: DEFAULT_REEL_ELEMENT_SETTINGS
      },
    ];
  }


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
    if (data.type === "repeater") {
      return new RepeaterElement(data, container);
    }
    if (data.type === "timed") {
      return new TimedElement(data, container);
    }
    if (data.type === "progress") {
      return new ProgressElement(data, container);
    }
    if (data.type === "progress-svg") {
      return new ProgressElementSvg(data, container);
    }
    if (data.type === "wheel") {
      return new WheelElement(data, container);
    }
    if (data.type === "reel") {
      return new ReelElement(data, container);
    }
    if (data.type === "animations") {
      return new AnimationsElement(data, container);
    }
    return new Element(data, container);
  }
}
