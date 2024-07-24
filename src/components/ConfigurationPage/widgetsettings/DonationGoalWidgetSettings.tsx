import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { DonationGoalLabelProperty } from "../widgetproperties/DonationGoalLabelProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { BackgroundProperty } from "../widgetproperties/BackgroundProperty";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("goals", "tab-donationgoal-goals");
    tabs.set("header", "tab-donationgoal-header");
    tabs.set("progressbar", "tab-donationgoal-bar");
    super(
      widgetId,
      properties,
      [
        new DonationGoalProperty(widgetId),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "descriptionFont",
          tab: "header",
          label: "widget-donationgoal-title-font-family",
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
        new BackgroundProperty({
          widgetId: widgetId,
          name: "background",
          displayName: "label-background",
          tab: "header"
        }),
        new DonationGoalLabelProperty(widgetId),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "amountFont",
          tab: "progressbar",
          label: "widget-donationgoal-amount-font-family",
        }),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#818181",
          "widget-donationgoal-background",
          "progressbar",
        ),
        new ColorProperty(
          widgetId,
          "filledColor",
          "color",
          "#00aa00",
          "widget-donationgoal-filled-color",
          "progressbar",
        ),
        new SingleChoiceProperty(
          widgetId,
          "filledTextAlign",
          "predefined",
          "left",
          "widget-donationgoal-amount-alignment",
          ["left", "center", "right"],
          "progressbar",
        ),
        new BorderProperty({
          widgetId: widgetId,
          name: "outerBorder",
          tab: "progressbar",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "innerBorder",
          tab: "progressbar",
        }),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }
}
