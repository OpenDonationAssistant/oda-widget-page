import { ColorProperty } from "../widgetproperties/ColorProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("content", "Содержимое");
    tabs.set("header", "Заголовок");
    tabs.set("list", "Список");
    tabs.set("layout", "Стиль");
    super(
      widgetId,
      properties,
      [
        new SingleChoiceProperty(
          widgetId,
          "type",
          "predefined",
          "All",
          "Тип виджета",
          ["All", "Top", "Last"],
          "content",
        ),
        new SingleChoiceProperty(
          widgetId,
          "period",
          "predefined",
          "month",
          "Период",
          ["month", "day"],
          "content",
        ),
        new NumberProperty(
          widgetId,
          "topsize",
          "number",
          "3",
          "Кол-во донатеров",
          "content",
        ),
        new TextProperty(
          widgetId,
          "title",
          "text",
          "Донатеры",
          "Заголовок",
          "header",
        ),
        new FontProperty(
          widgetId,
          "titleFont",
          "fontselect",
          "Roboto",
          "Шрифт заголовка",
          "header",
        ),
        new FontProperty(
          widgetId,
          "font",
          "fontselect",
          "Roboto",
          "Шрифт списка",
          "list",
        ),
        new NumberProperty(
          widgetId,
          "titleFontSize",
          "number",
          "24",
          "Размер шрифта заголовка",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "fontSize",
          "number",
          "24",
          "Размер шрифта списка",
          "list",
        ),
        new ColorProperty(
          widgetId,
          "titleColor",
          "color",
          "#ffffff",
          "Цвет заголовка",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "titleBackgroundColor",
          "color",
          "#000000",
          "Цвет фона заголовка",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "color",
          "color",
          "#ffffff",
          "Цвет списка",
          "list",
        ),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#000000",
          "Цвет фона списка",
          "list",
        ),
        new NumberProperty(
          widgetId,
          "titleAlphaChannel",
          "number",
          "1.0",
          "Прозрачность заголовка",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "alphaChannel",
          "number",
          "1.0",
          "Прозрачность списка",
          "list",
        ),
        new DonatersTopListLayoutProperty(widgetId, "vertical"),
      ],
      tabs,
    );
  }

  public copy() {
    return new DonatersTopListWidgetSettings(this.widgetId, this.properties);
  }
}
