import {
  DonationGoalProperty,
} from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("header", "Вид виджета");
    tabs.set("goals", "Цели");
    super(
      widgetId,
      properties,
      [
        new FontProperty(
          widgetId,
          "titleFont",
          "fontselect",
          "Alice",
          "Шрифт заголовка",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "titleFontSize",
          "number",
          "24",
          "Размер шрифта заголовка",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "titleColor",
          "color",
          "#000000",
          "Цвет заголовка",
          "header",
        ),
        new SingleChoiceProperty(
          widgetId,
          "titleTextAlign",
          "predefined",
          "left",
          "Выравнивание заголовка",
          ["left", "center", "right"],
          "header",
        ),
        new FontProperty(
          widgetId,
          "filledFont",
          "fontselect",
          "Russo One",
          "Шрифт суммы",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "filledFontSize",
          "number",
          "24",
          "Размер шрифта суммы",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledTextColor",
          "color",
          "#ffffff",
          "Цвет суммы",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#818181",
          "Цвет фона полоски",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledColor",
          "color",
          "#00aa00",
          "Цвет заполненной части",
          "header",
        ),
        new SingleChoiceProperty(
          widgetId,
          "filledTextAlign",
          "predefined",
          "left",
          "Выравнивание суммы",
          ["left", "center", "right"],
          "header",
        ),
        new DonationGoalProperty(widgetId),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }

}
