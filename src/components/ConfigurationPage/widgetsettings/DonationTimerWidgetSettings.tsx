import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("general", "Общие");
    super(
      widgetId,
      properties,
      [
        new BooleanProperty(
          widgetId,
          "resetOnLoad",
          "boolean",
          true,
          "widget-donation-timer-refresh",
          "general",
        ),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
          tab: "general",
        }),
        new TextProperty(
          widgetId,
          "text",
          "text",
          "Без донатов уже <time>",
          "widget-donation-timer-text",
          "general",
        ),
        new BorderProperty({
          widgetId: widgetId,
          name: "border",
          tab: "general",
        }),
      ],
      tabs
    );
  }
  copy() {
    return new DonationTimerWidgetSettings(this.widgetId, this.properties);
  }
}
