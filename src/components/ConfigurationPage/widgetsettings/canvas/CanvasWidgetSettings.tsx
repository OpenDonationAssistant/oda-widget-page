import { ReactNode } from "react";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import classes from "../AbstractWidgetSettings.module.css";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../widgetproperties/ColorProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { CanvasWidget } from "../../../../pages/Canvas/CanvasWidget";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";
import { Trans } from "react-i18next";

export class CanvasWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

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
            <Trans i18nKey="widget-canvas-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="widget-canvas-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-how-to-connect" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="widget-canvas-help-copy-link" />
            </li>
            <li>
              <Trans i18nKey="widget-help-obs-browser-source" />
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
    return <CanvasWidget settings={this} />;
  }
}
