import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { BackgroundImageProperty } from "../../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import { BoxShadowProperty } from "../../components/ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { TextProperty } from "../../components/ConfigurationPage/widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { DemoHistoryStore } from "../History/DemoHistoryStore";
import { HorizontalEventsModeProperty } from "./HorizontalEventsModeProperty";
import { HorizontalEventsWidget } from "./HorizontalEventsWidget";

export class HorizontalEventsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new HorizontalEventsModeProperty(),
        new NumberProperty({
          name: "speed",
          value: 50,
          displayName: "Скорость прокрутки",
          addon: "pixels/second",
        }),
      ],
    });

    this.addSection({
      key: "header",
      title: "Заголовок",
      properties: [
        // new ListProperty({
        //   name: "headerItems",
        //   displayName: "Элементы заголовка",
        //   value: [
        //     new AdvancedTextProperty({ name: "header", label: "Заголовок" }),
        //   ],
        //   factoryMethod: () =>
        //     new AdvancedTextProperty({ name: "header", label: "Заголовок" }),
        // }),
        new BooleanProperty({
          name: "showHeader",
          value: true,
          displayName: "Показывать заголовок",
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
            underline: false,
            animation: "none",
            animationType: "entire",
            animationSpeed: "normal",
            shadows:[]
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
        new BackgroundImageProperty({ name: "headerBackgroundImage" }),
        new BorderProperty({
          name: "headerBorder",
        }),
        new PaddingProperty({
          name: "headerPadding",
        }),
        new RoundingProperty({
          name: "headerRounding",
        }),
        new BoxShadowProperty({
          name: "headerShadow",
        }),
      ],
    });

    this.addSection({
      key: "events",
      title: "Событие",
      properties: [
        new BooleanProperty({
          name: "showNickname",
          value: true,
          displayName: "Показывать никнейм",
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
            underline: false,
            animation: "none",
            animationType: "entire",
            animationSpeed: "normal",
            shadows: []
          },
        }),
        new BooleanProperty({
          name: "showMessage",
          value: true,
          displayName: "Показывать сообщение",
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
            animationType: "entire",
            animationSpeed: "normal",
            shadows: []
          },
        }),
        new BooleanProperty({
          name: "showAmount",
          value: true,
          displayName: "Показывать сумму",
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
            underline: false,
            animation: "none",
            animationType: "entire",
            animationSpeed: "normal",
            shadows:[]
          },
        }),
        new NumberProperty({
          name: "eventGap",
          value: 12,
          displayName: "Отступ между событиями",
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
        new BackgroundImageProperty({ name: "eventsBackgroundImage" }),
        new BorderProperty({
          name: "eventsBorder",
        }),
        new PaddingProperty({
          name: "eventsPadding",
        }),
        new RoundingProperty({
          name: "eventsRounding",
        }),
        new BoxShadowProperty({ name: "eventsShadow" }),
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
        new BackgroundImageProperty({ name: "lineBackgroundImage" }),
        new BorderProperty({
          name: "lineBorder",
        }),
        new PaddingProperty({
          name: "linePadding",
        }),
        new RoundingProperty({
          name: "lineRounding",
        }),
        new BoxShadowProperty({
          name: "lineShadow",
        }),
      ],
    });
  }

  public get speed() {
    return this.get("speed") as NumberProperty;
  }

  public get showHeader() {
    return this.get("showHeader") as BooleanProperty;
  }

  public get showAmount() {
    return this.get("showAmount") as BooleanProperty;
  }

  public get showMessage() {
    return this.get("showMessage") as BooleanProperty;
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

  public hasDemo(): boolean {
    return true;
  }

  public demo() {
    return (
      <div style={{ width: "100%" }}>
        <HorizontalEventsWidget
          settings={this}
          store={new DemoHistoryStore()}
        />
      </div>
    );
  }
}
