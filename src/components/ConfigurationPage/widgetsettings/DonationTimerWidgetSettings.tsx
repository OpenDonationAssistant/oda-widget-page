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
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { PresetProperty } from "../widgetproperties/PresetProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { BlurProperty } from "../widgetproperties/BlurProperty";
import { BoxShadowProperty } from "../widgetproperties/BoxShadowProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "preset",
      title: "Готовые шаблоны",
      properties: [
        new PresetProperty({ type: "donation-timer", settings: this }),
      ],
    });

    this.addSection({
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
            outline: {
              enabled: false,
              width: 0,
              color: "#000000",
            },
            shadowColor: "rgb(255, 255, 255)",
            shadowWidth: 0,
            animationType: "entire",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        }),
        new SingleChoiceProperty({
          name: "textAlign",
          value: "left",
          displayName: "text-alignment",
          options: ["left", "center", "right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
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
        new RoundingProperty({
          name: "rounding",
        }),
        new PaddingProperty({
          name: "padding",
        }),
        new BoxShadowProperty({
          name: "boxShadow",
          displayName: "Тени виджета",
          help: "Устанавливает тени виджета.",
        }),
      ],
    });

    this.addSection({
      key: "effects",
      title: "Эффекты",
      properties: [
        new BlurProperty({
          name: "blur",
        }),
      ],
    });
  }

  public get boxShadowProperty(): BoxShadowProperty {
    return (
      (this.get("boxShadow") as BoxShadowProperty) ||
      new BoxShadowProperty({
        name: "boxShadow",
        displayName: "Тени виджета",
        help: "Устанавливает тени виджета.",
      })
    );
  }

  public get textAlign(): "left" | "center" | "right" {
    return this.get("textAlign")?.value || "left";
  }

  public get blurProperty(): BlurProperty {
    return (
      (this.get("blur") as BlurProperty) || new BlurProperty({ name: "blur" })
    );
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

  public get resetOnLoad(): boolean {
    const resetOnLoad =
      this.get("resetOnLoad") ??
      new BooleanProperty({
        name: "resetOnLoad",
        value: true,
        displayName: "widget-donation-timer-refresh",
      });
    return resetOnLoad.value;
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
