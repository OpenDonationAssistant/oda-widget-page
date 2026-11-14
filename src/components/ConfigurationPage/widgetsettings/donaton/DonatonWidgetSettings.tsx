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
import { Trans } from "react-i18next";

export class DonatonWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "General",
      properties: [
        new TextProperty({
          name: "text",
          value: "Стрим будет идти еще <time>",
          displayName: "widget-donaton-timer-text",
          help: "donaton-timer-text-help",
        }),
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
            animationSpeed: "normal",
            underline: false,
            animationType: "entire",
            shadows:[]
          },
        }),
        new DonatonPriceProperty(),
        new DateTimeProperty({
          name: "timer-end",
          displayName: "widget-donaton-timer-end",
          help: "donaton-timer-end-help",
        }),
      ],
    });

    this.addSection({
      key: "style",
      title: "tab-style",
      properties: [
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
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="donaton-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="donaton-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-howto-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="donaton-help-step1" />
            </li>
            <li>
              <Trans i18nKey="donaton-help-step2" />
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
