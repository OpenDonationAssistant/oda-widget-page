import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { produce } from "immer";
import {
  AnimatedFontProperty,
  DEFAULT_FONT_PROPERTY_VALUE,
} from "../widgetproperties/AnimatedFontProperty";
import classes from "./AbstractWidgetSettings.module.css";
import { ReactNode } from "react";

export class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new AnimatedFontProperty({
              name: "nicknameFont",
              label: "widget-payments-title-font",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Play";
                draft.size = 24;
                draft.color.colors[0].color = "#FBFFF1";
              }),
            }),
            new AnimatedFontProperty({
              name: "messageFont",
              label: "widget-payments-message-font",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Play";
                draft.size = 24;
                draft.color.colors[0].color = "#B4C5E4";
              }),
            }),
            new AnimatedFontProperty({
              name: "musicFont",
              label: "widget-payments-music-font",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Anonymous Pro";
                draft.size = 18;
                draft.color.colors[0].color = "#b39ddb";
              }),
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
          Виджет "События"
        </h3>
        <div className={`${classes.helpdescription}`}>
          Отображает список донатов, обновляется автоматически реал-тайм.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              В меню этого виджета (События) скопировать ссылку.
            </li>
            <li>
              Добавить как Dock в OBS Studio.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
