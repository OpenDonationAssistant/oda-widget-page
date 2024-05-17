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
    tabs.set("general", "Общие");
    tabs.set("prizes", "Призы");
    super(
      widgetId,
      properties,
      [
        new FontProperty(
          widgetId,
          "font",
          "fontselect",
          "Roboto",
          "Шрифт",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "fontSize",
          "number",
          24,
          "Размер шрифта",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "color",
          "color",
          "#000000",
          "Цвет текста",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "borderColor",
          "color",
          "#FF0000",
          "Цвет рамок",
          "general",
        ),
        new ColorProperty(
          widgetId,
          "selectionColor",
          "color",
          "#00FF00",
          "Фон выбора",
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
          "Отображаемое кол-во карточек",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "speed",
          "number",
          250,
          "Время (мс) на один поворот",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "time",
          "number",
          10,
          "Время (сек), сколько крутить до выпадения результата",
          "general",
        ),
        new NumberProperty(
          widgetId,
          "requiredAmount",
          "number",
          100,
          "Требуемая сумма",
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
