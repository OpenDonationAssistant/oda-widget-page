import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
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
        ),
        new AnimatedFontProperty({
          widgetId:widgetId,
          name:"titleFont"
        }),
        new TextProperty(
          widgetId,
          "text",
          "text",
          "Без донатов уже <time>",
          "widget-donation-timer-text",
        ),
      ],
      new Map(),
    );
  }
  copy(){
    return new DonationTimerWidgetSettings(this.widgetId, this.properties);
  }
}
