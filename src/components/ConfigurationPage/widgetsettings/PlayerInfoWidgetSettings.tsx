import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { SELECTION_TYPE, SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("general", "Общие");
    tabs.set("title", "Название");
    tabs.set("requester", "Заказчик");
    tabs.set("queue", "Очередь");
    super(
      widgetId,
      properties,
      [
        new SingleChoiceProperty({
          widgetId: widgetId,
          name: "widgetType",
          tab: "general",
          value: "Старый",
          displayName:  "Вид виджета",
          options:["Старый","Новый"],
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "background",
          tab: "general",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
          displayName: "label-background",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "widgetBorder",
          tab: "general",
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "rounding",
          tab: "general",
        }),
        new PaddingProperty({
          widgetId: widgetId,
          name: "padding",
          tab: "general",
        }),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
          tab: "title",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "titleBackground",
          tab: "title",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
          displayName: "label-background",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "titleBorder",
          tab: "title",
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "titleRounding",
          tab: "title",
        }),
        new SingleChoiceProperty({
          widgetId: widgetId,
          name: "showRequester",
          tab: "requester",
          value: "show",
          displayName:  "display-requester",
          options:["show","hide"],
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "requesterFont",
          tab: "requester",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "requesterBackground",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
          displayName: "label-background",
          tab: "requester",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "requesterBorder",
          tab: "requester",
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "requesterRounding",
          tab: "requester",
        }),
        new PaddingProperty({
          widgetId: widgetId,
          name: "requesterPadding",
          tab: "requester",
        }),
        new SingleChoiceProperty({
          widgetId: widgetId,
          name: "showQueueSize",
          tab: "queue",
          value: "show",
          displayName:  "display-queue-size",
          options:["show","hide"],
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "queueFont",
          tab: "queue",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "queueBackground",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
          displayName: "label-background",
          tab: "queue",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "queueBorder",
          tab: "queue",
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "queueRounding",
          tab: "queue",
        }),
        new PaddingProperty({
          widgetId: widgetId,
          name: "queuePadding",
          tab: "queue",
        }),
      ],
      tabs,
    );
  }

  copy() {
    return new PlayerInfoWidgetSettings(this.widgetId, this.properties);
  }
}
