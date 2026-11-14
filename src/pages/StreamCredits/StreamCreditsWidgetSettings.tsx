import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowProperty } from "../../components/ConfigurationPage/widgetproperties/BoxShadowProperty";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { AlignmentProperty } from "../../components/ConfigurationPage/widgetproperties/AlignmentProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";

export class StreamCreditsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "stream-credits-tab-general",
          properties: [
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new AnimatedFontProperty({
              name: "creditsFont",
            }),
            new NumberProperty({
              displayName: "stream-credits-scroll-speed",
              name: "speed",
              addon: "px/sec",
              value: 10,
            }),
            new AlignmentProperty({
              name: "textAlign",
              displayName: "text-alignment",
            }),
            new ColorProperty({
              name: "backgroundColor",
              displayName: "background-color",
              value: {
                gradient: false,
                angle: 0,
                repeating: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                colors: [{ color: "#FFFFFF00" }],
              },
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new BackgroundImageProperty({
              name: "backgroundImage",
            }),
            new WidthProperty({
              name: "width",
            }),
            new HeightProperty({
              name: "height",
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
            new BoxShadowProperty({
              name: "boxShadow",
              displayName: "widget-shadow",
              help: t("widget-shadow-help"),
            }),
          ],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="stream-credits-help-title" />
        </h3>
        <div className={`${classes.helpdescription}`}></div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-how-to-connect" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="stream-credits-help-copy-link" />
            </li>
            <li>
              <Trans i18nKey="widget-help-paste-link" />
            </li>
            <li>
              <Trans i18nKey="stream-credits-help-add-video" />
            </li>
          </ul>
        </div>
      </>
    );
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    return <></>;
  }

  public get titleFontProperty(): AnimatedFontProperty {
    return (
      (this.get("titleFont") as AnimatedFontProperty) ||
      new AnimatedFontProperty({
        name: "titleFont",
      })
    );
  }

  public get creditsFontProperty(): AnimatedFontProperty {
    return (
      (this.get("creditsFont") as AnimatedFontProperty) ||
      new AnimatedFontProperty({
        name: "creditsFont",
      })
    );
  }

  public get speedProperty(): NumberProperty {
    return (
      (this.get("speed") as NumberProperty) ||
      new NumberProperty({
        displayName: "stream-credits-scroll-speed",
        name: "speed",
        addon: "px/sec",
        value: 10,
      })
    );
  }

  public get textAlignProperty(): AlignmentProperty {
    return (
      (this.get("textAlign") as AlignmentProperty) ||
      new AlignmentProperty({
        name: "textAlign",
        displayName: "text-alignment",
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

  public get backgroundImageProperty(): BackgroundImageProperty {
    return (
      (this.get("backgroundImage") as BackgroundImageProperty) ||
      new BackgroundImageProperty({
        name: "backgroundImage",
      })
    );
  }

  public get widthProperty(): WidthProperty {
    return (
      (this.get("width") as WidthProperty) ||
      new WidthProperty({
        name: "width",
      })
    );
  }

  public get heightProperty(): HeightProperty {
    return (
      (this.get("height") as HeightProperty) ||
      new HeightProperty({
        name: "height",
      })
    );
  }

  public get borderProperty(): BorderProperty {
    return (
      (this.get("border") as BorderProperty) ||
      new BorderProperty({
        name: "border",
      })
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
      new RoundingProperty({
        name: "rounding",
      })
    );
  }

  public get boxShadowProperty(): BoxShadowProperty {
    return (
      (this.get("boxShadow") as BoxShadowProperty) ||
      new BoxShadowProperty({
        name: "boxShadow",
      })
    );
  }
}
