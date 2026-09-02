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

export class CanvasWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "style",
      title: "Стиль",
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
          <h3 className={`${classes.helptitle}`}>Виджет "Canvas"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Виджет для группировки других виджетов внутри себя.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Canvas) скопировать ссылку.</li>
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
    return <CanvasWidget settings={this} />;
  }
}
