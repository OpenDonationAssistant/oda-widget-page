import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { FontProperty } from "../widgetproperties/FontProperty";
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
          "All",
          "widget-donaterslist-widget-type",
          ["All", "Top", "Last"],
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
        new TextProperty(
          widgetId,
          "title",
          "text",
          "Донатеры",
          "widget-donaterslist-title",
          "header",
        ),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "headerFont",
          tab: "header"
        }),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "messageFont",
          tab: "list"
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
        new DonatersTopListLayoutProperty(widgetId, "vertical"),
      ],
      tabs,
    );
  }

  public copy() {
    return new DonatersTopListWidgetSettings(this.widgetId, this.properties);
  }
}
