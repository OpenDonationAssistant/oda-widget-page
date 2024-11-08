import { ReactNode } from "react";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../widgetproperties/ColorProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ReelItemBackgroundProperty } from "../widgetproperties/ReelItemBackgroundProperty";
import { ReelItemListProperty } from "../widgetproperties/ReelItemListProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";

export class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "tab-reel-general",
          properties: [
            new NumberProperty({
              name: "requiredAmount",
              value: 100,
              addon: "₽",
              displayName: "widget-reel-required-amount",
            }),
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new BorderProperty({
              name: "widgetBorder",
            }),
            new BorderProperty({
              name: "cardBorder",
            }),
            new ColorProperty({
              name: "selectionColor",
              displayName: "widget-reel-background-color",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new NumberProperty({
              name: "perView",
              value: 5,
              addon: "карт", // TODO: localize
              displayName: "widget-reel-displayed-amount",
            }),
            new NumberProperty({
              name: "speed",
              value: 250,
              addon: "ms",
              displayName: "widget-reel-turning-time",
            }),
            new NumberProperty({
              name: "time",
              value: 10,
              addon: "sec",
              displayName: "widget-reel-waiting-time",
            }),
          ],
        },
        {
          key: "prizes",
          title: "tab-reel-prizes",
          properties: [
            new ReelItemListProperty(),
            new ReelItemBackgroundProperty(),
          ],
        },
      ],
    });
  }
  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Рулетка"</h3>
        <div className={`${classes.helpdescription}`}>
          Позволяет запускать рулетку на донаты, в которой выграет одна из карточек - "призов". Запускается на каждый донат больше заданной суммы.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              Задать сумму для запуска рулетки в строке 'Требуемая сумма'.
            </li>
            <li>
              Добавить карточки-призы во вкладке Призы.
            </li>
            <li>
              В меню этого виджета (Рулетка) скопировать ссылку и вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
