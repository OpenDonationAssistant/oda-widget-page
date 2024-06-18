import {
  DonationGoalProperty,
} from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("header", "tab-donationgoal-appearance");
    tabs.set("goals", "tab-donationgoal-goals");
    super(
      widgetId,
      properties,
      [
        new FontProperty(
          widgetId,
          "titleFont",
          "fontselect",
          "Alice",
          "widget-donationgoal-title-font-family",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "titleFontSize",
          "number",
          "24",
          "widget-donationgoal-title-font-size",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "titleColor",
          "color",
          "#000000",
          "widget-donationgoal-title-color",
          "header",
        ),
        new SingleChoiceProperty(
          widgetId,
          "titleTextAlign",
          "predefined",
          "left",
          "widget-donationgoal-title-alignment",
          ["left", "center", "right"],
          "header",
        ),
        new FontProperty(
          widgetId,
          "filledFont",
          "fontselect",
          "Russo One",
          "widget-donationgoal-amount-font-family",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "filledFontSize",
          "number",
          "24",
          "widget-donationgoal-amount-font-size",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledTextColor",
          "color",
          "#ffffff",
          "widget-donationgoal-amount-color",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#818181",
          "widget-donationgoal-background",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledColor",
          "color",
          "#00aa00",
          "widget-donationgoal-filled-color",
          "header",
        ),
        new SingleChoiceProperty(
          widgetId,
          "filledTextAlign",
          "predefined",
          "left",
          "widget-donationgoal-amount-alignment",
          ["left", "center", "right"],
          "header",
        ),
        new DonationGoalProperty(widgetId),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }

}
