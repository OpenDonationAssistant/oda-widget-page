import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { DonationGoalLabelProperty } from "../widgetproperties/DonationGoalLabelProperty";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("header", "tab-donationgoal-appearance");
    tabs.set("goals", "tab-donationgoal-goals");
    super(
      widgetId,
      properties,
      [
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "descriptionFont",
          tab: "header",
          label: "widget-donationgoal-title-font-family"
        }),
        new SingleChoiceProperty(
          widgetId,
          "titleTextAlign",
          "predefined",
          "left",
          "widget-donationgoal-title-alignment",
          ["left", "center", "right"],
          "header",
        ),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "amountFont",
          tab: "header",
          label: "widget-donationgoal-amount-font-family"
        }),
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
        new DonationGoalLabelProperty(widgetId),
        new DonationGoalProperty(widgetId),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }
}
