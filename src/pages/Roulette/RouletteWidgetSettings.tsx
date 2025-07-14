import { ReactNode } from "react";
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

export class RouletteWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
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
              displayName: "Тени виджета",
              help: "Устанавливает тени виджета.",
            }),
          ],
        },
        {
          key: "items",
          title: "Лоты",
          properties: [new RouletteItemsProperty()],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Рулетка"</h3>
        <div className={`${classes.helpdescription}`}></div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
            <li>Добавить видео в плеер, проверить что виджет отображается.</li>
          </ul>
        </div>
      </>
    );
  }
}
