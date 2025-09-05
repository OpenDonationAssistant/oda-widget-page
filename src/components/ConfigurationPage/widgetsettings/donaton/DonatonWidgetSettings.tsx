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
import { DonatonWidget } from "../../../../pages/Donaton/DonatonWidget";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";

export class DonatonWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new TextProperty({
          name: "text",
          value: "Стрим будет идти еще <time>",
          displayName: "widget-donaton-timer-text",
          help: "Надпись на таймере",
        }),
        new DonatonPriceProperty(),
        new DateTimeProperty({
          name: "timer-end",
          displayName: "widget-donaton-timer-end",
          help: "Время, до которого будет отсчитывать таймер. Подразумевается, что это время окончания стрима. В любой момент можно выставить новое время, таймер обновится.",
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
            outline: {
              enabled: false,
              width: 0,
              color: "rgb(255, 255, 255)",
            },
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
        new BackgroundImageProperty({ name: "backgroundImage" }),
        new BorderProperty({
          name: "border",
        }),
        new PaddingProperty({
          name: "padding",
        }),
        new RoundingProperty({
          name: "rounding",
        }),
        new BoxShadowProperty({ name: "shadow" }),
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

  public get shadowProperty(): BoxShadowProperty {
    return (
      (this.get("shadow") as BoxShadowProperty) ||
      new BoxShadowProperty({ name: "shadow" })
    );
  }

  public get backgroundImageProperty(): BackgroundImageProperty {
    return (
      (this.get("backgroundImage") as BackgroundImageProperty) ||
      new BackgroundImageProperty({ name: "backgroundImage" })
    );
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Донатон"</h3>
          <CloseOverlayButton />
        </Flex>
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

  public hasDemo() {
    return true;
  }

  public demo() {
    return <DonatonWidget settings={this} />;
  }
}
