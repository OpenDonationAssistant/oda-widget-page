import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("general", "Общие");
    super(
      widgetId,
      properties,
      [
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
          tab: "general",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "widgetBorder",
          tab: "general",
        }),
        new RoundingProperty({
          widgetId: widgetId,
          name: "rounding",
          tab: "general",
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "background",
          tab: "general",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
          displayName: "label-background",
        }),
      ],
      tabs,
    );
  }

  copy() {
    return new PlayerInfoWidgetSettings(this.widgetId, this.properties);
  }
}
