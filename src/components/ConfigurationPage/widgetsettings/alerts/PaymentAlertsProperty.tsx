import { ReactNode, useContext, useEffect, useState } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { AlertComponent } from "./AlertComponent";
import { Flex, Switch } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../../types/WidgetData";
import { log } from "../../../../logging";
import { publish } from "../../../../socket";
import { uuidv7 } from "uuidv7";
import { extendObservable, observable, reaction, toJS } from "mobx";
import SubActionButton from "../../../Button/SubActionButton";
import CloseIcon from "../../../../icons/CloseIcon";
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
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../../../stores/SelectedIndexStore";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../../Wizard/WizardComponent";
import { AddAlertWizardStoreContext } from "./AddAlertWizard";
import { PresetWindow } from "../../PresetsComponent";
import { Preset } from "../../../../types/Preset";
import { deepEqual } from "../../../../utils";
import { TriggersStore } from "./triggers/TriggersStore";

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

const AlertItemComponent = observer(
  ({ alert, open }: { alert: Alert; open: boolean }) => {
    const { conf } = useLoaderData() as WidgetData;
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [alertDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState, () => {}, open),
    );
    const selection = useContext(SelectedIndexContext);

    return (
      <ModalStateContext.Provider value={alertDialogState}>
        <ListItem
          onClick={() => {
            selection.id = alert.id;
            alertDialogState.show = true;
          }}
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
  },
);

const ChooseTemplate = observer(({}: {}) => {
  const [presetSelection] = useState<SelectedIndexStore>(
    () => new SelectedIndexStore(),
  );
  const wizardStore = useContext(AddAlertWizardStoreContext);
  return (
    <SelectedIndexContext.Provider value={presetSelection}>
      <Flex
        vertical
        gap={12}
        className="withscroll"
        style={{ maxHeight: "75vh", width: "100%" }}
      >
        <PresetWindow
          type="alert"
          onSelect={(preset: Preset) => {
            presetSelection.id = preset.name;
            wizardStore.preset = preset;
          }}
        />
      </Flex>
    </SelectedIndexContext.Provider>
  );
});

const PaymentAlertsPropertyComponent = observer(
  ({ property }: { property: PaymentAlertsProperty }) => {
    const [selection] = useState<SelectedIndexStore>(
      () => new SelectedIndexStore(),
    );
    const wizardStore = useContext(AddAlertWizardStoreContext);
    const [wizardConfiguration] = useState<WizardConfigurationStore>(
      () =>
        new WizardConfigurationStore({
          steps: [
            {
              title: "Выберите шаблон",
              subtitle: "",
              content: <ChooseTemplate />,
              handler: () => {
                return Promise.resolve(true);
              },
            },
          ],
          dynamicStepAmount: true,
          reset: () => {
            log.debug("reset addalert wizard");
            wizardStore.reset();
          },
          finish: () => {
            log.debug("finish addalert wizard");
            const added = wizardStore.property?.addAlert();
            log.debug(
              {
                property: toJS(wizardStore.property),
                added: toJS(added),
                preset: toJS(wizardStore.preset),
              },
              "finish adding alert",
            );
            if (added) {
              wizardStore.preset?.applyTo(added, "alert");
              selection.id = added.id;
            }
            wizardStore.reset();
            return Promise.resolve();
          },
        }),
    );

    useEffect(() => {
      reaction(
        () => wizardStore.preset,
        () => {
          wizardConfiguration.canContinue = !!wizardStore.preset;
        },
      );
    }, [wizardStore, wizardConfiguration]);

    wizardStore.property = property;

    return (
      <SelectedIndexContext.Provider value={selection}>
        <Wizard configurationStore={wizardConfiguration} />
        <List>
          {property.value.map((alert) => (
            <AlertItemComponent
              key={alert.id}
              alert={alert}
              open={selection.id === alert.id}
            />
          ))}
          <AddListItemButton
            label="button-add-alert"
            onClick={() => wizardConfiguration.next()}
          />
        </List>
      </SelectedIndexContext.Provider>
    );
  },
);

export class PaymentAlertsProperty extends DefaultWidgetProperty<Alert[]> {
  private _oldValue: any[] = [];
  private static _triggersStore = new TriggersStore();

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
      if (loaded.triggers) {
        loaded.triggers = loaded.triggers.map((trigger) =>
          this._triggersStore.loadTrigger(trigger),
        );
      }
      log.debug({ source: it, result: loaded }, "loading alert");
      return loaded;
    });
    return property;
  }

  public config() {
    return this.value.map((it) => it.config());
  }

  addAlert(alert?: Alert): Alert {
    const alertToAdd =
      alert ||
      new Alert({
        removeFn: (id: string) => this.removeAlert(id),
        addFn: (alert: Alert) => this.addAlert(),
      });
    this._value = [...this._value, alertToAdd];
    return alertToAdd;
  }

  removeAlert(id: string) {
    this.value = this.value.filter((alert) => alert.id !== id);
  }

  public get sortedAlerts(): Alert[] {
    return this.value
      .filter((alert) => alert.property("enabled"))
      .sort((a, b) => a.compareTriggers(b));
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
      if (!deepEqual(toJS(valueToCheck[i]), toJS(this._oldValue[i]))) {
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

  copy() {
    const copied = new PaymentAlertsProperty();
    this._value.forEach((alert) =>
      copied.addAlert(
        new Alert({
          audio: alert.audio ?? undefined,
          image: alert.image ?? undefined,
          video: alert.video ?? undefined,
          triggers: [],
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
