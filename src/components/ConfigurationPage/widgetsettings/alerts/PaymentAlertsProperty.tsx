import { MouseEventHandler, ReactNode, useContext, useState } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { AlertComponent } from "./AlertComponent";
import { Collapse, Flex, Input, Modal, Switch } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../../types/WidgetData";
import { log } from "../../../../logging";
import { publish } from "../../../../socket";
import { uuidv7 } from "uuidv7";
import { extendObservable, observable, toJS } from "mobx";
import SubActionButton from "../../../SubActionButton/SubActionButton";
import CloseIcon from "../../../../icons/CloseIcon";
import { EditableString } from "../../../RenamableLabel/EditableString";
import ArrowUp from "../../../../icons/ArrowUp";
import ArrowDown from "../../../../icons/ArrowDown";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../../Overlay/Overlay";
import CopyIcon from "../../../../icons/CopyIcon";
import { BorderedIconButton } from "../../../IconButton/IconButton";

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
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
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
    const [opened, setOpened] = useState<string>("");
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      new ModalState(parentModalState),
    );
    const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

    return (
      <>
        <ModalStateContext.Provider value={deleteDialogState}>
          <Overlay>
            <Warning
              action={() => {
                deleteDialogState.show = false;
                alertToDelete?.delete();
              }}
            >
              Вы точно хотите удалить оповещение?
            </Warning>
          </Overlay>
          {property.value.length > 0 && (
            <div className={`${classes.preview}`}>
              <Collapse
                activeKey={opened}
                collapsible="disabled"
                expandIcon={({ isActive }) => (
                  <div>{isActive ? <ArrowUp /> : <ArrowDown />}</div>
                )}
                expandIconPosition="end"
                items={property.value.map((it, index) => {
                  log.debug({ it: it }, "create view for alert");
                  const switcher = () => {
                    if (opened === it.id) {
                      setOpened("");
                    } else if (opened === String(index)) {
                      setOpened("");
                    } else {
                      setOpened(it.id ?? String(index));
                    }
                  };
                  const clickHandler: MouseEventHandler = (e) => {
                    if (e.target === e.currentTarget) {
                      switcher();
                    }
                  };

                  return {
                    key: it.id ?? index,
                    showArrow: false,
                    label: (
                      <Flex
                        key={it.id ?? index}
                        justify="space-between"
                        align="center"
                        onClick={clickHandler}
                      >
                        <Flex align="center" gap={18}>
                          <EditableString
                            label={it.property("name")}
                            onChange={(value) => it.set("name", value)}
                            onClick={switcher}
                          />
                          <Switch
                            value={it.property("enabled")}
                            onChange={(value) => it.set("enabled", value)}
                          />
                        </Flex>
                        <Flex className={`${classes.alertbuttons}`} gap={9}>
                          <SubActionButton
                            onClick={() => testAlert(conf.topic.alerts, it)}
                          >
                            <div>Тест</div>
                          </SubActionButton>
                          <BorderedIconButton
                            onClick={() => {
                              it.copy();
                            }}
                          >
                            <CopyIcon />
                          </BorderedIconButton>
                          <BorderedIconButton
                            onClick={() => {
                              setAlertToDelete(it);
                              deleteDialogState.show = true;
                            }}
                          >
                            <CloseIcon color="#FF8888" />
                          </BorderedIconButton>
                          <Flex
                            justify="center"
                            align="center"
                            onClick={switcher}
                          >
                            {(it.id === opened || String(index) === opened) && (
                              <ArrowUp />
                            )}
                            {it.id !== opened && String(index) !== opened && (
                              <ArrowDown />
                            )}
                          </Flex>
                        </Flex>
                      </Flex>
                    ),
                    children: (
                      <AlertComponent key={it.id ?? index} alert={it} />
                    ),
                  };
                })}
              />
            </div>
          )}
          <button
            className={`${classes.adddalertbutton}`}
            onClick={() => property.addAlert()}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">add</span>
              <div>{t("button-add-alert")}</div>
            </Flex>
          </button>
        </ModalStateContext.Provider>
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
        { new: toJS(valueToCheck[i]), old: toJS(this._oldValue[i]) },
        "compare alerts",
      );
      if (!this.deepEqual(toJS(valueToCheck[i]), toJS(this._oldValue[i]))) {
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

  copy() {
    const copied = new PaymentAlertsProperty();
    this._value.forEach((alert) =>
      copied.addAlert(
        new Alert({
          audio: alert.audio ?? undefined,
          image: alert.image ?? undefined,
          video: alert.video ?? undefined,
          triggers: undefined,
          properties: alert.properties.map((prop) => prop.copy()),
          removeFn: copied.removeAlert,
          addFn: copied.addAlert,
        }),
      ),
    );
    return copied;
  }

  markup(): ReactNode {
    return <PaymentAlertsPropertyComponent property={this} />;
  }
}
