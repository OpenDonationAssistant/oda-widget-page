import { ColorProperty } from "../widgetproperties/ColorProperty";
import { FontProperty } from "../widgetproperties/FontProperty";
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
        new FontProperty(
          widgetId,
          "font",
          "fontselect",
          "Roboto",
          "widget-reel-font-family",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "fontSize",
          "number",
          24,
          "widget-reel-font-size",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "color",
          "color",
          "#000000",
          "widget-reel-color",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "borderColor",
          "color",
          "#FF0000",
          "widget-reel-border-color",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "borderWidth",
          "number",
          1,
          "widget-reel-border-width",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "selectionColor",
          "color",
          "#00FF00",
          "widget-reel-background-color",
          "general",
        ),
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
        new NumberProperty(
          widgetId,
          "requiredAmount",
          "number",
          100,
          "widget-reel-required-amount",
          "general",
        ),
        new ReelItemListProperty(
          widgetId,
          ["Ничего", "Выигрыш"]
        ),
        new ReelItemBackgroundProperty(
          widgetId,
          ""
        ),
      ],
      tabs,
    );
  }

  copy(){
    return new ReelWidgetSettings(this.widgetId, this.properties);
  }

}
