import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { AlertComponent } from "./AlertComponent";
import { Collapse, Flex, Input, Modal } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../../types/WidgetData";
import { log } from "../../../../logging";
import { publish } from "../../../../socket";
import { uuidv7 } from "uuidv7";
import { extendObservable, observable } from "mobx";

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

export const RenameButton = observer(({ alert }: { alert: Alert }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(alert.property("name"));

  const toggleModal = () => {
    setShowModal((old) => !old);
  };

  return (
    <>
      <Modal
        title="Help"
        open={showModal}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={() => {
          alert.update("name", newName);
          toggleModal();
        }}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
      <button className="menu-button" onClick={toggleModal}>
        <span className="material-symbols-sharp">stylus</span>
      </button>
    </>
  );
});

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
        {property.value.length > 0 && (
          <div className={`${classes.preview}`}>
            <Collapse
              items={property.value.map((it, index) => {
                log.debug({ it: it }, "create view for alert");
                return {
                  key: it.id ?? index,
                  label: (
                    <Flex
                      key={it.id ?? index}
                      justify="space-between"
                      align="center"
                    >
                      <div>{it.property("name")}</div>
                      <Flex className={`${classes.alertbuttons}`}>
                        <button
                          className="menu-button"
                          onClick={() => testAlert(conf.topic.alerts, it)}
                        >
                          <span className="material-symbols-sharp">
                            play_circle
                          </span>
                        </button>
                        <button
                          className="menu-button"
                          onClick={() => it.copy()}
                        >
                          <span className="material-symbols-sharp">
                            content_copy
                          </span>
                        </button>
                        <RenameButton alert={it} />
                        <button
                          className="menu-button"
                          onClick={() => it.delete()}
                        >
                          <span className="material-symbols-sharp">delete</span>
                        </button>
                      </Flex>
                    </Flex>
                  ),
                  children: <AlertComponent key={it.id ?? index} alert={it} />,
                };
              })}
            />
          </div>
        )}
      </>
    );
  },
);

export class PaymentAlertsProperty extends DefaultWidgetProperty<Alert[]> {
  private _oldValue: any[] = [];
  constructor() {
    super({
      name: "alerts",
      value: [],
      displayName: "",
    });
    extendObservable(this, {
      _oldValue: observable,
    });
  }

  public static fromConfig(config: any): PaymentAlertsProperty {
    const property = new PaymentAlertsProperty();
    property.value = config.map((it: any) => {
      const loaded = new Alert({
        ...it,
        ...{
          removeFn: (id: string) => property.removeAlert(id),
          addFn: (alert: Alert) => property.addAlert(alert),
        },
      });
      log.debug({ source: it, result: loaded }, "loading alert");
      return loaded;
    });
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

  public markSaved(): void {
    log.debug("markSaved", this._value);
    this._oldValue = this._value.map((it) => it.config());
    this._initialValue = this._value;
  }

  public get changed(): boolean {
    log.debug("calc is alerts changed");
    const valueToCheck = this.value.map((it) => it.config());
    let changed = false;
    if (valueToCheck.length !== this._oldValue.length) {
      changed = true;
    }
    for (let i = 0; i < valueToCheck.length; i++) {
      log.debug(
        { new: valueToCheck[i], old: this._oldValue[i] },
        "compare alerts",
      );
      if (!this.deepEqual(valueToCheck[i], this._oldValue[i])) {
        changed = true;
      }
    }
    // const result = super.deepEqual(this._oldValue, valueToCheck);
    if (changed) {
      log.debug(
        {
          changed: this,
          newValue: valueToCheck,
          initialValue: this._oldValue,
        },
        "alert change detected",
      );
    }
    return changed;
  }

  removeAlert(id: string) {
    this.value = this.value.filter((alert) => alert.id !== id);
  }

  markup(): ReactNode {
    return <PaymentAlertsPropertyComponent property={this} />;
  }
}
