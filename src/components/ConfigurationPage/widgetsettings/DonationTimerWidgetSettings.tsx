import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
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
        new FontProperty(widgetId, "font", "fontselect", "Andika", "widget-donation-timer-font-family"),
        new NumberProperty(
          widgetId,
          "fontSize",
          "string",
          "24",
          "widget-donation-timer-font-size",
        ),
        new ColorProperty(widgetId, "color", "color", "#ffffff", "widget-donation-timer-color"),
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
