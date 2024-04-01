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
          "Обнулять таймер при открытии",
        ),
        new FontProperty(widgetId, "font", "fontselect", "Andika", "Шрифт"),
        new NumberProperty(
          widgetId,
          "fontSize",
          "string",
          "24",
          "Размер шрифта",
        ),
        new ColorProperty(widgetId, "color", "color", "#ffffff", "Цвет"),
        new TextProperty(
          widgetId,
          "text",
          "text",
          "Без донатов уже <time>",
          "Текст",
        ),
      ],
      new Map(),
    );
  }
  copy(){
    return new DonationTimerWidgetSettings(this.widgetId, this.properties);
  }
}
