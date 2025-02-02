import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { AlertComponent } from "./AlertComponent";
import { Collapse, Flex } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../../types/WidgetData";
import { log } from "../../../../logging";
import { publish } from "../../../../socket";
import { uuidv7 } from "uuidv7";

function testAlert(topic: string, alert: Alert) {
  publish(topic, {
    id: uuidv7(), // TODO: сделать опциональным
    alertId: alert.id,
    nickname: "Тестовый алерт",
    message: "Тестовое сообщение",
    amount: {
      major: 100,
      minor: 0,
      currency: "RUB",
    },
  });
  log.debug("Send test alert");
}

const PaymentAlertsPropertyComponent = observer(
  ({ property }: { property: PaymentAlertsProperty }) => {
    const { t } = useTranslation();
    const { conf } = useLoaderData() as WidgetData;

    return (
      <>
        <div className={`${classes.adddalertbutton}`}>
          <button
            className="oda-btn-default"
            onClick={() => property.addAlert()}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">add</span>
              <div>{t("button-add-alert")}</div>
            </Flex>
          </button>
        </div>
        {property.value.length > 0 && <div className={`${classes.preview}`}>
          <Collapse
            items={property.value.map((it, index) => {
              return {
                key: it.id ?? index,
                label: (
                  <Flex justify="space-between" align="center">
                    <div>{it.property("name") ?? it.id ?? index}</div>
                    <Flex className={`${classes.alertbuttons}`}>
                      <button
                        className="menu-button"
                        onClick={() => testAlert(conf.topic.alerts, it)}
                      >
                        <span className="material-symbols-sharp">
                          play_circle
                        </span>
                      </button>
                      <button className="menu-button" onClick={() => it.copy()}>
                        <span className="material-symbols-sharp">
                          content_copy
                        </span>
                      </button>
                      <button className="menu-button" onClick={() => it.copy()}>
                        <span className="material-symbols-sharp">
                          stylus
                        </span>
                      </button>
                      <button
                        className="menu-button"
                        onClick={() => it.delete()}
                      >
                        <span className="material-symbols-sharp">delete</span>
                      </button>
                    </Flex>
                  </Flex>
                ),
                children: <AlertComponent alert={it} />,
              };
            })}
          />
        </div>
        }
      </>
    );
  },
);

export class PaymentAlertsProperty extends DefaultWidgetProperty<Alert[]> {
  constructor() {
    super({
      name: "alerts",
      value: [],
      displayName: "",
    });
  }

  public static fromConfig(config: any): PaymentAlertsProperty {
    const property = new PaymentAlertsProperty();
    property.value = config.map(
      (it: any) =>
        new Alert({
          ...it,
          ...{
            removeFn: (id: string) => property.removeAlert(id),
            addFn: (alert: Alert) => property.addAlert(alert),
          },
        }),
    );
    return property;
  }

  public config() {
    return this.value.map((it) => it.config());
  }

  addAlert(alert?: Alert): void {
    this._value = [
      ...this._value,
      alert
        ? alert
        : new Alert({
            removeFn: (id: string) => this.removeAlert(id),
            addFn: (alert: Alert) => this.addAlert(),
          }),
    ];
  }

  removeAlert(id: string) {
    this.value = this.value.filter((alert) => alert.id !== id);
  }

  markup(): ReactNode {
    return <PaymentAlertsPropertyComponent property={this} />;
  }
}
