import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { ColorProperty, ColorPropertyTarget } from "../widgetproperties/ColorProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ReelItemBackgroundProperty } from "../widgetproperties/ReelItemBackgroundProperty";
import { ReelItemListProperty } from "../widgetproperties/ReelItemListProperty";
import {
  DefaultWidgetProperty,
  WidgetProperty,
} from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("general", "tab-reel-general");
    tabs.set("prizes", "tab-reel-prizes");
    super(
      widgetId,
      properties,
      [
        new NumberProperty(
          widgetId,
          "requiredAmount",
          "number",
          100,
          "widget-reel-required-amount",
          "general",
        ),
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
          tab: "general",
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "widgetBorder",
          tab: "general"
        }),
        new BorderProperty({
          widgetId: widgetId,
          name: "cardBorder",
          tab: "general"
        }),
        new ColorProperty({
          widgetId: widgetId,
          name: "selectionColor",
          displayName: "widget-reel-background-color",
          tab: "general",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new DefaultWidgetProperty(
          widgetId,
          "type",
          "custom",
          "eachpayment",
          "Условие",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "perView",
          "number",
          5,
          "widget-reel-displayed-amount",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "speed",
          "number",
          250,
          "widget-reel-turning-time",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "time",
          "number",
          10,
          "widget-reel-waiting-time",
          "general",
        ),
        new ReelItemListProperty(widgetId, ["Ничего", "Выигрыш"]),
        new ReelItemBackgroundProperty(widgetId, ""),
      ],
      tabs,
    );
  }

  copy() {
    return new ReelWidgetSettings(this.widgetId, this.properties);
  }
}
