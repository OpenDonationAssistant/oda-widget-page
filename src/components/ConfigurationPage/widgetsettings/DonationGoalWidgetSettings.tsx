import { ColorProperty } from "../widgetproperties/ColorProperty";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import {
  DefaultWidgetProperty,
  WidgetProperty,
} from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {

  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    // tabs.set("general", "Общие");
    // tabs.set("prizes", "Призы");
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
          "requiredAmount",
          "number",
          100,
          "Требуемая сумма",
          "general",
        ),
        new DefaultWidgetProperty(
          widgetId,
          "optionList",
          "custom",
          ["Ничего", "Выигрыш"],
          "Призы",
          "prizes",
        ),
        new DefaultWidgetProperty(
          widgetId,
          "backgroundImage",
          "custom",
          "",
          "Фон карточек",
          "prizes",
        ),
        new DefaultWidgetProperty(
          widgetId,
          "winnerBackgroundImage",
          "custom",
          "",
          "Фон выигрыша",
          "prizes",
        ),
      ],
      tabs,
    );
  }

  copy(){
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }

}
