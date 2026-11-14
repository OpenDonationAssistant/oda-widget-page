import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "./RouletteWidgetSettings.module.css";
import { RouletteItemsProperty } from "./RoutetteItemsProperty";
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
import { RouletteWidget } from "./RouletteWidget";
import { DemoReelStore } from "../../stores/ReelStore";

export class RouletteWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "roulette-tab-general",
          properties: [
            new ColorProperty({
              name: "widgetBackgroundColor",
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
        {
          key: "items",
          title: "roulette-tab-items",
          properties: [new RouletteItemsProperty()],
        },
      ],
    });
  }

  public get itemsProperty(): RouletteItemsProperty {
    return this.get("roulette-items") as RouletteItemsProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="roulette-help-title" />
        </h3>
        <div className={`${classes.helpdescription}`}></div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-how-to-connect" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="roulette-help-copy-link" />
            </li>
            <li>
              <Trans i18nKey="widget-help-paste-link" />
            </li>
            <li>
              <Trans i18nKey="roulette-help-add-video" />
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
    return (
      <RouletteWidget
        settings={this}
        store={new DemoReelStore(20000, this.itemsProperty.value)}
      />
    );
  }
}
