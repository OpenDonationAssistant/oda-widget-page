import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { DonatersTopListCarouselProperty } from "../widgetproperties/DonatersTopListCarouselProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "content",
          title: "tab-donaters-list-content",
          properties: [
            new SingleChoiceProperty({
              name: "type",
              value: "Top",
              displayName: "widget-donaterslist-widget-type",
              options: ["Top", "Last"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new SingleChoiceProperty({
              name: "period",
              value: "month",
              displayName: "widget-donaterslist-period",
              options: ["month", "day"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new NumberProperty({
              name: "topsize",
              value: 3,
              displayName: "widget-donaterslist-donaters-amount",
            }),
            new BooleanProperty({
              name: "hideEmpty",
              value: false,
              displayName: "widget-donaterslist-hide-empty",
            }),
          ],
        },
        {
          key: "header",
          title: "tab-donaters-list-title",
          properties: [
            new TextProperty({
              name: "title",
              value: "Донатеры ",
              displayName: "widget-donaterslist-title",
            }),
            new AnimatedFontProperty({
              name: "headerFont",
            }),
            new SingleChoiceProperty({
              name: "headerAlignment",
              value: "Center",
              displayName: "widget-donaterslist-list-alignment",
              options: ["Left", "Center", "Right"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new ColorProperty({
              name: "titleBackgroundColor",
              displayName: "widget-donaterslist-title-background-color",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new BorderProperty({
              name: "headerBorder",
            }),
          ],
        },
        {
          key: "list",
          title: "tab-donaters-list-list",
          properties: [
            new AnimatedFontProperty({
              name: "messageFont",
            }),
            new ColorProperty({
              name: "backgroundColor",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              displayName: "widget-donaterslist-list-background-color",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new SingleChoiceProperty({
              name: "listAlignment",
              value: "Center",
              displayName: "widget-donaterslist-list-alignment",
              options: ["Left", "Center", "Right"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new NumberProperty({
              name: "gap",
              value: 1,
              displayName: "widget-donaterslist-gap",
            }),
            new BorderProperty({
              name: "listBorder",
            }),
          ],
        },
        {
          key: "layout",
          title: "tab-donaters-list-style",
          properties: [
            new DonatersTopListLayoutProperty(),
            new DonatersTopListCarouselProperty(),
            new BorderProperty({
              name: "widgetBorder",
            }),
          ],
        },
      ],
    });
  }
}
