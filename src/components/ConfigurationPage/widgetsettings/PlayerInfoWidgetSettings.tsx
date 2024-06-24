import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    super(
      widgetId,
      properties,
      [
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
        }),
      ],
      new Map(),
    );
  }

  copy() {
    return new PlayerInfoWidgetSettings(this.widgetId, this.properties);
  }
}
