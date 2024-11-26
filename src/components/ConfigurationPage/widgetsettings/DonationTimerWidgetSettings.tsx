import { ReactNode, createContext } from "react";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../widgetproperties/ColorProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new BooleanProperty({
              name: "resetOnLoad",
              value: true,
              displayName: "widget-donation-timer-refresh",
            }),
            new TextProperty({
              name: "text",
              value: "Без донатов уже <time>",
              displayName: "widget-donation-timer-text",
            }),
          ],
        },
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
          value: {
            isSame: null,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
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
        <h3 className={`${classes.helptitle}`}>Виджет "Таймер донатов"</h3>
        <div className={`${classes.helpdescription}`}>
          Считает время с момента последнего доната, обновляется автоматически
          реал-тайм.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Таймер донатов) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export const DonationTimerWidgetSettingsContext = createContext(
  new DonationTimerWidgetSettings(),
);
