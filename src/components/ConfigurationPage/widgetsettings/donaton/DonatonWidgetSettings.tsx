import { ReactNode } from "react";
import { AnimatedFontProperty } from "../../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { TextProperty } from "../../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import classes from "../AbstractWidgetSettings.module.css";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../widgetproperties/ColorProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import {
  DateTimeProperty,
  DateTimePropertyValue,
} from "../../widgetproperties/DateTimeProperty";
import { DonatonPriceProperty } from "./DonatonPriceProperty";
import { PresetProperty } from "../../widgetproperties/PresetProperty";

export class DonatonWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "preset",
      title: "Готовые шаблоны",
      properties: [new PresetProperty({ type: "donaton", settings: this })],
    });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new TextProperty({
          name: "text",
          value: "Стрим будет идти еще <time>",
          displayName: "widget-donaton-timer-text",
          help: "Надпись на таймере"
        }),
        new DonatonPriceProperty(),
        new DateTimeProperty({
          name: "timer-end",
          displayName: "widget-donaton-timer-end",
          help: "Время, до которого будет отсчитывать таймер. Подразумевается, что это время окончания стрима. В любой момент можно выставить новое время, таймер обновится."
        }),
      ],
    });

    this.addSection({
      key: "style",
      title: "Стиль",
      properties: [
        new AnimatedFontProperty({
          name: "titleFont",
          value: {
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
          name: "backgroundColor",
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
          name: "border",
        }),
        new PaddingProperty({
          name: "padding",
        }),
        new RoundingProperty({
          name: "rounding",
        }),
      ],
    });
  }

  public get textProperty(): string {
    return this.get("text")?.value || "Стрим будет идти еще <time>";
  }

  public get timerEndProperty(): DateTimePropertyValue {
    return this.get("timer-end")?.value || { timestamp: Date.now() };
  }

  public get titleFontProperty(): AnimatedFontProperty {
    return (
      (this.get("titleFont") as AnimatedFontProperty) ||
      new AnimatedFontProperty({
        name: "titleFont",
      })
    );
  }

  public get backgroundColorProperty(): ColorProperty {
    return (
      (this.get("backgroundColor") as ColorProperty) ||
      new ColorProperty({
        name: "backgroundColor",
        displayName: "background-color",
        target: ColorPropertyTarget.BACKGROUND,
      })
    );
  }

  public get borderProperty(): BorderProperty {
    return (
      (this.get("border") as BorderProperty) ||
      new BorderProperty({ name: "border" })
    );
  }

  public get paddingProperty(): PaddingProperty {
    return (
      (this.get("padding") as PaddingProperty) ||
      new PaddingProperty({
        name: "padding",
      })
    );
  }

  public get roundingProperty(): RoundingProperty {
    return (
      (this.get("rounding") as RoundingProperty) ||
      new RoundingProperty({ name: "rounding" })
    );
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Донатон"</h3>
        <div className={`${classes.helpdescription}`}>
          Запускает обратный отсчет до конца стрима. Таймер увеличивается в
          зависимости от суммы доната.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Донатон) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
