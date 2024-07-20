import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { DonatersTopListCarouselProperty } from "../widgetproperties/DonatersTopListCarouselProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
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
        new SingleChoiceProperty(
          widgetId,
          "type",
          "predefined",
          "Top",
          "widget-donaterslist-widget-type",
          ["Top", "Last"],
          "content",
        ),
        new SingleChoiceProperty(
          widgetId,
          "period",
          "predefined",
          "month",
          "widget-donaterslist-period",
          ["month", "day"],
          "content",
        ),
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
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "messageFont",
          tab: "list",
        }),
        new ColorProperty(
          widgetId,
          "titleBackgroundColor",
          "color",
          "#000000",
          "widget-donaterslist-title-background-color",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#000000",
          "widget-donaterslist-list-background-color",
          "list",
        ),
        new SingleChoiceProperty(
          widgetId,
          "listAlignment",
          "predefined",
          "Center",
          "widget-donaterslist-list-alignment",
          ["Left", "Center", "Right"],
          "list",
        ),
        new DonatersTopListLayoutProperty(widgetId, "vertical"),
        new DonatersTopListCarouselProperty(widgetId),
      ],
      tabs,
    );
  }

  public copy() {
    return new DonatersTopListWidgetSettings(this.widgetId, this.properties);
  }
}
