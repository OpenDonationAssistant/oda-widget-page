import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { TextProperty } from "../../components/ConfigurationPage/widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { HorizontalEventsModeProperty } from "./HorizontalEventsModeProperty";

export class HorizontalEventsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    //this.addSection({
    //  key: "preset",
    //  title: "Готовые шаблоны",
    //  properties: [
    //    new PresetProperty({ type: "horizontal-events", settings: this }),
    //  ],
    //});

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [new HorizontalEventsModeProperty()],
    });

    this.addSection({
      key: "header",
      title: "Заголовок",
      properties: [
        new BooleanProperty({
          name: "showHeader",
          value: true,
          displayName: "Показывать заголовок"
        }),
        new TextProperty({
          name: "headerText",
          value: "Последние донаты:",
          displayName: "Заголовок",
        }),
        new AnimatedFontProperty({
          name: "headerFont",
          value: {
            outline: { enabled: true, width: 1, color: "#000000" },
            size: 24,
            color: {
              angle: 0,
              colors: [
                {
                  color: "#FFFFFF",
                },
              ],
              gradient: false,
              repeating: false,
              gradientType: 0,
            },
            family: "Play",
            italic: false,
            weight: true,
            animation: "none",
            underline: false,
            shadowColor: "rgb(255, 255, 255)",
            shadowWidth: 0,
            animationType: "entire",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        }),
        new ColorProperty({
          name: "headerBackgroundColor",
          displayName: "background-color",
          target: ColorPropertyTarget.BACKGROUND,
          value: {
            angle: 0,
            colors: [
              {
                color: "rgba(0, 0, 0, 0)",
              },
            ],
            gradient: false,
            repeating: false,
            gradientType: 0,
          },
        }),
        new BorderProperty({
          name: "headerBorder",
        }),
        new PaddingProperty({
          name: "headerPadding",
        }),
        new RoundingProperty({
          name: "headerRounding",
        }),
      ],
    });

    this.addSection({
      key: "events",
      title: "Событие",
      properties: [
        new BooleanProperty({
          name: "showMessage",
          value: true,
          displayName: "Показывать сообщение",
        }),
        new BooleanProperty({
          name: "showAmount",
          value: true,
          displayName: "Показывать сумму",
        }),
        new NumberProperty({
          name: "eventGap",
          value: 12,
          displayName: "Отступ между событиями"
        }),
        new AnimatedFontProperty({
          name: "eventsAmountFont",
          label: "Шрифт суммы",
          value: {
            outline: { enabled: false, width: 0, color: "#000000" },
            size: 24,
            color: {
              angle: 0,
              colors: [
                {
                  color: "#684aff",
                },
              ],
              gradient: false,
              repeating: false,
              gradientType: 0,
            },
            family: "Play",
            italic: false,
            weight: true,
            animation: "none",
            underline: false,
            shadowColor: "rgb(255, 255, 255)",
            shadowWidth: 0,
            animationType: "entire",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        }),
        new AnimatedFontProperty({
          name: "eventsNicknameFont",
          label: "Шрифт никнейма",
          value: {
            outline: { enabled: false, width: 0, color: "#000000" },
            size: 24,
            color: {
              angle: 0,
              colors: [
                {
                  color: "#684aff",
                },
              ],
              gradient: false,
              repeating: false,
              gradientType: 0,
            },
            family: "Play",
            italic: false,
            weight: true,
            animation: "none",
            underline: false,
            shadowColor: "rgb(255, 255, 255)",
            shadowWidth: 0,
            animationType: "entire",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        }),
        new AnimatedFontProperty({
          name: "eventsMessageFont",
          label: "Шрифт сообщения доната",
          value: {
            outline: { enabled: false, width: 0, color: "#000000" },
            size: 24,
            color: {
              angle: 0,
              colors: [
                {
                  color: "#684aff",
                },
              ],
              gradient: false,
              repeating: false,
              gradientType: 0,
            },
            family: "Play",
            italic: false,
            weight: true,
            animation: "none",
            underline: false,
            shadowColor: "rgb(255, 255, 255)",
            shadowWidth: 0,
            animationType: "entire",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        }),
        new ColorProperty({
          name: "eventsBackgroundColor",
          displayName: "background-color",
          target: ColorPropertyTarget.BACKGROUND,
          value: {
            angle: 0,
            colors: [
              {
                color: "rgba(0, 0, 0, 0)",
              },
            ],
            gradient: false,
            repeating: false,
            gradientType: 0,
          },
        }),
        new BorderProperty({
          name: "eventsBorder",
        }),
        new PaddingProperty({
          name: "eventsPadding",
        }),
        new RoundingProperty({
          name: "eventsRounding",
        }),
      ],
    });

    this.addSection({
      key: "line",
      title: "Полоска",
      properties: [
        new ColorProperty({
          name: "lineBackgroundColor",
          displayName: "background-color",
          target: ColorPropertyTarget.BACKGROUND,
          value: {
            angle: 0,
            colors: [
              {
                color: "rgba(0, 0, 0, 0)",
              },
            ],
            gradient: false,
            repeating: false,
            gradientType: 0,
          },
        }),
        new BorderProperty({
          name: "lineBorder",
        }),
        new PaddingProperty({
          name: "linePadding",
        }),
        new RoundingProperty({
          name: "lineRounding",
        }),
      ],
    });
  }

  public get showHeader() {
    return this.get("showHeader") as BooleanProperty;
  }

  public get headerText() {
    return this.get("headerText") as TextProperty;
  }

  public get headerFont() {
    return this.get("headerFont") as AnimatedFontProperty;
  }

  public get headerBackgroundColor() {
    return this.get("headerBackgroundColor") as ColorProperty;
  }

  public get headerBorder() {
    return this.get("headerBorder") as BorderProperty;
  }

  public get headerPadding() {
    return this.get("headerPadding") as PaddingProperty;
  }

  public get headerRounding() {
    return this.get("headerRounding") as RoundingProperty;
  }
  public get eventGap() {
    return this.get("eventGap") as NumberProperty;
  }
  public get eventsAmountFont() {
    return this.get("eventsAmountFont") as AnimatedFontProperty;
  }
  public get eventsNicknameFont() {
    return this.get("eventsNicknameFont") as AnimatedFontProperty;
  }
  public get eventsMessageFont() {
    return this.get("eventsMessageFont") as AnimatedFontProperty;
  }

  public get eventsBackgroundColor() {
    return this.get("eventsBackgroundColor") as ColorProperty;
  }
  public get eventsBorder() {
    return this.get("eventsBorder") as BorderProperty;
  }

  public get eventsPadding() {
    return this.get("eventsPadding") as PaddingProperty;
  }

  public get eventsRounding() {
    return this.get("eventsRounding") as RoundingProperty;
  }

  public get lineBackgroundColor() {
    return this.get("lineBackgroundColor") as ColorProperty;
  }

  public get lineBorder() {
    return this.get("lineBorder") as BorderProperty;
  }

  public get linePadding() {
    return this.get("linePadding") as PaddingProperty;
  }

  public get lineRounding() {
    return this.get("lineRounding") as RoundingProperty;
  }
}
