import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { ColorProperty, ColorPropertyTarget, GRADIENT_TYPE } from "../widgetproperties/ColorProperty";
import { DonatersTopListCarouselProperty } from "../widgetproperties/DonatersTopListCarouselProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { SELECTION_TYPE, SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("content", "tab-donaters-list-content");
    tabs.set("header", "tab-donaters-list-title");
    tabs.set("list", "tab-donaters-list-list");
    tabs.set("layout", "tab-donaters-list-style");
    super(
      widgetId,
      properties,
      [
        new SingleChoiceProperty({
          widgetId:widgetId,
          name:"type",
          value:"Top",
          displayName:"widget-donaterslist-widget-type",
          options:["Top", "Last"],
          tab:"content",
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new SingleChoiceProperty({
          widgetId:widgetId,
          name:"period",
          value:"month",
          displayName:"widget-donaterslist-period",
          options:["month", "day"],
          tab:"content",
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new NumberProperty(
          widgetId,
          "topsize",
          "number",
          "3",
          "widget-donaterslist-donaters-amount",
          "content",
        ),
        new BooleanProperty(
          widgetId,
          "hideEmpty",
          "boolean",
          false,
          "widget-donaterslist-hide-empty",
          "content",
        ),
        new TextProperty(
          widgetId,
          "title",
          "text",
          "Донатеры ",
          "widget-donaterslist-title",
          "header",
        ),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "headerFont",
          tab: "header",
        }),
        new SingleChoiceProperty({
          widgetId:widgetId,
          name:"headerAlignment",
          value:"Center",
          displayName:"widget-donaterslist-list-alignment",
          options:["Left", "Center", "Right"],
          tab:"header",
          selectionType: SELECTION_TYPE.SEGMENTED
        }),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "messageFont",
          tab: "list",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "titleBackgroundColor",
          displayName: "widget-donaterslist-title-background-color",
          tab: "header",
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
          widgetId: widgetId,
          name: "headerBorder",
          tab: "header",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "backgroundColor",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          displayName: "widget-donaterslist-list-background-color",
          tab: "list",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new SingleChoiceProperty({
          widgetId:widgetId,
          name:"listAlignment",
          value: "Center",
          displayName: "widget-donaterslist-list-alignment",
          options: ["Left", "Center", "Right"],
          tab: "list",
          selectionType:  SELECTION_TYPE.SEGMENTED
        }),
        new NumberProperty(
          widgetId,
          "gap",
          "number",
          "1",
          "widget-donaterslist-gap",
          "list",
        ),
        new BorderProperty({
          widgetId: widgetId,
          name: "listBorder",
          tab: "list",
        }),
        new DonatersTopListLayoutProperty(widgetId, "vertical"),
        new DonatersTopListCarouselProperty(widgetId),
        new BorderProperty({
          widgetId: widgetId,
          name: "widgetBorder",
          tab: "layout",
        }),
      ],
      tabs,
    );
  }

  public copy() {
    return new DonatersTopListWidgetSettings(this.widgetId, this.properties);
  }
}
