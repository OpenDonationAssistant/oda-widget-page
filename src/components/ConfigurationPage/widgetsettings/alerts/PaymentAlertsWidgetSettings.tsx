import { toJS } from "mobx";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { PaymentAlertsProperty } from "./PaymentAlertsProperty";
import { log } from "../../../../logging";
import { ReactNode } from "react";
import classes from "../AbstractWidgetSettings.module.css";

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
        <h3 className={`${classes.helptitle}`}>Виджет "Алерты"</h3>
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

  public prepareConfig(): { name: string; value: any }[] {
    if (this._alerts === undefined) {
      log.debug({ settings: this._alerts }, "nullable alerts ");
      return [];
    }
    return [
      {
        name: this._alerts.name,
        value: this._alerts.config(),
      },
    ];
  }

  public set(key: string, value: any, asInitialValue = false): void {
    log.debug(
      { key: key, value: value },
      "calling payment alerts widget settings",
    );
    this.sections = this.sections.map((section) => {
      if (section.key === "alerts") {
        section.properties = section.properties.map((prop) => {
          if (prop.name === key) {
            const updated = PaymentAlertsProperty.fromConfig(value);
            this._alerts = updated;
            log.debug({ updated: toJS(updated) }, "updated payment alerts");
            if (asInitialValue) {
              updated.markSaved();
            }
            return updated;
          }
          return prop;
        });
      }
      this.makeIndex();
      return section;
    });
    log.debug({ sections: this.sections }, "updated settings");
  }
}
