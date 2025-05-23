import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { HorizontalEventsModeProperty } from "../../components/ConfigurationPage/widgetsettings/horizontalevents/HorizontalEventsModePropertyents/HorizontalEventsModeProperty";

export class HorizantalEventsWidgetSettings extends AbstractWidgetSettings {
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
        new AnimatedFontProperty({
          name: "eventsFont",
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

  public get headerFont() {
    return this.get("headerFont") as AnimatedFontProperty;
  }
  public get headerBackgroundColor() {
    return this.get("headerBackgroundColor");
  }
  public get headerBorder() {
    return this.get("headerBorder");
  }

  public get headerPadding() {
    return this.get("headerPadding");
  }

  public get headerRounding() {
    return this.get("headerRounding");
  }
  public get eventsFont() {
    return this.get("eventsFont");
  }

  public get eventsBackgroundColor() {
    return this.get("eventsBackgroundColor");
  }
  public get eventsBorder() {
    return this.get("eventsBorder");
  }

  public get eventsPadding() {
    return this.get("eventsPadding");
  }

  public get eventsRounding() {
    return this.get("eventsRounding");
  }

  public get lineBackgroundColor(){
    return this.get("lineBackgroundColor");
  }

  public get lineBorder(){
    return this.get("lineBorder");
  }

  public get linePadding(){
    return this.get("linePadding");
  }

  public get lineRounding(){
    return this.get("lineRounding")
  }

}
