import { toJS } from "mobx";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { PaymentAlertsProperty } from "./PaymentAlertsProperty";
import { log } from "../../../../logging";
import { ReactNode } from "react";
import classes from "../AbstractWidgetSettings.module.css";
import TestAlertPopup from "../../../TestAlertPopup/TestAlertPopup";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { PremoderationProperty } from "./PremoderationProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  private _alerts: PaymentAlertsProperty;

  constructor() {
    const defaultAlert = new PaymentAlertsProperty();
    super({
      sections: [
        {
          key: "alerts",
          title: "tab-alert-alerts",
          properties: [defaultAlert],
        },
        {
          key: "configs",
          title: "tab-alert-configs",
          properties: [
            new PremoderationProperty({}),
            new BooleanProperty({
              name: "pause-media",
              value: true,
              displayName: "Паузить медиаплеер",
            }),
          ],
        },
      ],
    });
    this._alerts = defaultAlert;
  }

  public get alerts() {
    return this._alerts;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Алерты"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Показывает алерты для донатов. Пока поддерживает только донаты через
          ОДА.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              Добавить алерт кнопкой 'Добавить оповещение' во вкладке
              'Оповещения'.
            </li>
            <li>
              В строке 'Срабатывает когда' выбрать условие (например 'Сумма
              доната больше') и задать сумму в появившемся поле.
            </li>
            <li>Добавить гиф/картинку во вкладке Изображение.</li>
            <li>Добавить звук во вкладке "Аудио" кнопкой "Загрузить аудио"</li>
            <li>
              В меню этого виджета (Алерты) скопировать ссылку и вставить ссылку
              как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public subactions(): ReactNode {
    return <TestAlertPopup />;
  }

  public hasDemo(): boolean {
    return false;
  }
}
