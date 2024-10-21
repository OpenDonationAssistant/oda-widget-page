import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new BooleanProperty({
              name: "resetOnLoad",
              value: true,
              displayName: "widget-donation-timer-refresh",
            }),
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new TextProperty({
              name: "text",
              value: "Без донатов уже <time>",
              displayName: "widget-donation-timer-text",
            }),
            new BorderProperty({
              name: "border",
            }),
          ],
        },
      ],
    });
  }
}
