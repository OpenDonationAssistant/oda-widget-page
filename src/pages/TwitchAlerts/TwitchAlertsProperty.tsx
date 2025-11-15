import { ReactNode, useContext, useState } from "react";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { AddListItemButton, List, ListItem } from "../../components/List/List";
import { log } from "../../logging";
import classes from "./TwitchAlertsProperty.module.css";
import { Flex } from "antd";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../stores/SelectedIndexStore";
import {
  FullscreenPanel,
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../components/Overlay/Overlay";
import { uuidv7 } from "uuidv7";
import SubActionButton from "../../components/Button/SubActionButton";
import CopyIcon from "../../icons/CopyIcon";
import { TwitchAlert, TwitchAlertData } from "./types";
import { ItemContent } from "./TwitchAlertsItemSettings";

export const TWITCH_ALERT_DEFAULT_NAME = "<Без названия>";

const TwitchAlertItemComponent = observer(
  ({ alert }: { alert: TwitchAlert }) => {
    const selection = useContext(SelectedIndexContext);
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [contentDialogState] = useState<ModalState>(
      () =>
        new ModalState(
          parentModalState,
          () => {},
          selection.id === alert.data.id,
        ),
    );

    return (
      <ModalStateContext.Provider value={contentDialogState}>
        <ListItem
          first={
            <div className={`${classes.goaltitle}`}>{alert.data.name}</div>
          }
          second={
            <Flex align="center" justify="flex-end" gap={3}>
              <SubActionButton onClick={() => {}}>
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
          onClick={() => {
            selection.id = alert.data.id;
            contentDialogState.show = true;
          }}
        />
        <Overlay>
          <FullscreenPanel>
            <ItemContent alert={alert} />
          </FullscreenPanel>
        </Overlay>
      </ModalStateContext.Provider>
    );
  },
);

const TwitchAlertsPropertyComponent = observer(
  ({ property }: { property: TwitchAlertsProperty }) => {
    const [selection] = useState<SelectedIndexStore>(
      () => new SelectedIndexStore(),
    );

    return (
      <SelectedIndexContext.Provider value={selection}>
        <List>
          {property.alerts.map((alert: TwitchAlert) => (
            <TwitchAlertItemComponent key={alert.data.id} alert={alert} />
          ))}
          <AddListItemButton
            onClick={() => property.addAlert()}
            label="button-add-goal"
          />
        </List>
      </SelectedIndexContext.Provider>
    );
  },
);

export class TwitchAlertsProperty extends DefaultWidgetProperty<
  TwitchAlertData[]
> {
  constructor() {
    super({
      name: "alerts",
      value: [],
      displayName: "Оповещения",
    });
  }

  public get alerts(): TwitchAlert[] {
    return this.value.map(
      (alert: TwitchAlertData) => new TwitchAlert(alert, this),
    );
  }

  addAlert() {
    this.value.push({
      id: uuidv7(),
      name: TWITCH_ALERT_DEFAULT_NAME,
      enabled: true,
      triggers: [],
      elements: [],
      audio: [],
    });
    log.debug({ settings: this }, "updated twitch alerts");
  }

  deleteAlert({ index, id }: { index?: number; id?: string }) {
    if (index === undefined && id === undefined) {
      return;
    }
    if (index === undefined) {
      index = this.value.findIndex((alert) => alert.id === id);
    }
    this.value.splice(index, 1);
    log.debug({ settings: this }, "updated twitch alerts");
  }

  updateAlert(index: number, alert: TwitchAlertData) {
    this.value.splice(index, 1, alert);
    log.debug({ settings: this }, "updated twitch alerts");
  }

  copyAlert({ index, id }: { index?: number; id?: string }) {
    if (index === undefined && id === undefined) {
      return;
    }
    if (index === undefined) {
      index = this.value.findIndex((alert) => alert.id === id);
    }
    const alert = this.value[index];
    this.value.push({
      id: uuidv7(),
      name: alert.name,
      enabled: alert.enabled,
      elements: alert.elements,
      triggers: alert.triggers,
      audio: alert.audio,
    });
    log.debug({ settings: this }, "updated twitch alerts");
  }

  copy() {
    return new TwitchAlertsProperty();
  }

  markup(): ReactNode {
    return <TwitchAlertsPropertyComponent property={this} />;
  }
}
