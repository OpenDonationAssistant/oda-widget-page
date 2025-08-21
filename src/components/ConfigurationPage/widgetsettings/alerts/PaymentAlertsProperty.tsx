import { MouseEventHandler, ReactNode, useContext, useState } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { AlertComponent } from "./AlertComponent";
import { Flex, Switch } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../../types/WidgetData";
import { log } from "../../../../logging";
import { publish } from "../../../../socket";
import { uuidv7 } from "uuidv7";
import { extendObservable, observable, toJS } from "mobx";
import SubActionButton from "../../../SubActionButton/SubActionButton";
import CloseIcon from "../../../../icons/CloseIcon";
import { EditableString } from "../../../RenamableLabel/EditableString";
import {
  FullscreenPanel,
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../../Overlay/Overlay";
import CopyIcon from "../../../../icons/CopyIcon";
import { BorderedIconButton } from "../../../IconButton/IconButton";
import { AddListItemButton, List, ListItem } from "../../../List/List";

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

const AlertItemComponent = observer(({ alert }: { alert: Alert }) => {
  const { conf } = useLoaderData() as WidgetData;
  const parentModalState = useContext(ModalStateContext);
  const [deleteDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [alertDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

  return (
    <ModalStateContext.Provider value={alertDialogState}>
      <ListItem
        onClick={() => (alertDialogState.show = true)}
        first={
          <Flex align="center" gap={18}>
            <div className={`${classes.alerttitle}`}>
              {alert.property("name")}
            </div>
            <Switch
              value={alert.property("enabled")}
              onChange={(value) => alert.set("enabled", value)}
            />
          </Flex>
        }
        second={
          <Flex className={`${classes.alertbuttons}`} gap={9}>
            <SubActionButton
              onClick={() => testAlert(conf.topic.alerts, alert)}
            >
              <div>Тест</div>
            </SubActionButton>
            <BorderedIconButton
              onClick={() => {
                alert.copy();
              }}
            >
              <CopyIcon />
            </BorderedIconButton>
            <ModalStateContext.Provider value={deleteDialogState}>
              <Overlay>
                <Warning
                  action={() => {
                    deleteDialogState.show = false;
                    alert.delete();
                  }}
                >
                  Вы точно хотите удалить оповещение?
                </Warning>
              </Overlay>
              <BorderedIconButton
                onClick={() => (deleteDialogState.show = true)}
              >
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            </ModalStateContext.Provider>
          </Flex>
        }
      />
      <Overlay>
        <FullscreenPanel>
          <AlertComponent alert={alert} />
        </FullscreenPanel>
      </Overlay>
    </ModalStateContext.Provider>
  );
});

const PaymentAlertsPropertyComponent = observer(
  ({ property }: { property: PaymentAlertsProperty }) => {

    return (
      <>
        <List>
          {property.value.map((alert) => (
            <AlertItemComponent key={alert.id} alert={alert} />
          ))}
          <AddListItemButton
            label="button-add-alert"
            onClick={() => property.addAlert()}
          />
        </List>
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
