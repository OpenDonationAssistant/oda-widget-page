import { ReactNode } from "react";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";

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
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new TextProperty({
              name: "text",
              value: "Без донатов уже <time>",
              displayName: "widget-donation-timer-text",
            }),
            new BorderProperty({
              name: "border",
            }),
          ],
        },
      ],
    });
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
