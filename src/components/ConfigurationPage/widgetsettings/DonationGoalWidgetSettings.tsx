import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { ColorProperty, ColorPropertyTarget } from "../widgetproperties/ColorProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { DonationGoalLabelProperty } from "../widgetproperties/DonationGoalLabelProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";

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
        new SingleChoiceProperty({
          widgetId: widgetId,
          name: "titleTextAlign",
          value: "left",
          displayName: "widget-donationgoal-title-alignment",
          options: ["left", "center", "right"],
          tab: "header",
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "border",
          tab: "header",
        }),
        new DonationGoalLabelProperty(widgetId),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "amountFont",
          tab: "progressbar",
          label: "widget-donationgoal-amount-font-family",
        }),
        new SingleChoiceProperty({
          widgetId: widgetId,
          name: "filledTextAlign",
          value: "left",
          displayName: "widget-donationgoal-amount-alignment",
          options: ["left", "center", "right"],
          tab: "progressbar",
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "backgroundColor",
          displayName: "widget-donationgoal-background",
          tab: "progressbar",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "filledColor",
          displayName: "widget-donationgoal-filled-color",
          tab: "progressbar",
          target: ColorPropertyTarget.BACKGROUND,
        }),
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
        new RoundingProperty({
          widgetId: widgetId,
          name: "innerRounding",
          tab: "progressbar",
          displayName: "label-filled-rounding"
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "outerRounding",
          tab: "progressbar",
          displayName: "label-outer-rounding"
        }),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }
}
