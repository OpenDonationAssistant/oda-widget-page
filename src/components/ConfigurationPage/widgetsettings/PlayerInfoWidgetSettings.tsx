import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new SingleChoiceProperty({
              name: "widgetType",
              value: "Старый",
              displayName: "Вид виджета",
              options: ["Старый", "Новый"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new ColorProperty({
              name: "background",
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
              name: "widgetBorder",
            }),
            new RoundingProperty({
              name: "rounding",
            }),
            new PaddingProperty({
              name: "padding",
            }),
          ],
        },
        {
          key: "title",
          title: "Title",
          properties: [
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new ColorProperty({
              name: "titleBackground",
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
              name: "titleBorder",
            }),
            new RoundingProperty({
              name: "titleRounding",
            }),
          ],
        },
        {
          key: "requester",
          title: "Requester",
          properties: [
            new SingleChoiceProperty({
              name: "showRequester",
              value: "show",
              displayName: "display-requester",
              options: ["show", "hide"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new AnimatedFontProperty({
              name: "requesterFont",
            }),
            new ColorProperty({
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
            }),
            new BorderProperty({
              name: "requesterBorder",
            }),
            new RoundingProperty({
              name: "requesterRounding",
            }),
            new PaddingProperty({
              name: "requesterPadding",
            }),
          ],
        },
        {
          key: "queue",
          title: "Queue",
          properties: [
            new SingleChoiceProperty({
              name: "showQueueSize",
              value: "show",
              displayName: "display-queue-size",
              options: ["show", "hide"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new AnimatedFontProperty({
              name: "queueFont",
            }),
            new ColorProperty({
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
            }),
            new BorderProperty({
              name: "queueBorder",
            }),
            new RoundingProperty({
              name: "queueRounding",
            }),
            new PaddingProperty({
              name: "queuePadding",
            }),
          ],
        },
      ],
    });
  }
}
