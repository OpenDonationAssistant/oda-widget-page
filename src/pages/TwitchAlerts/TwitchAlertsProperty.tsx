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
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import CopyIcon from "../../icons/CopyIcon";
import { TwitchAlertData } from "./types";
import { ItemContent } from "./TwitchAlertsItemSettings";

export const TWITCH_ALERT_DEFAULT_NAME = "<Без названия>";

function testAlert(topic: string, alert: TwitchAlertData) {
  // publish(topic, {
  //   id: uuidv7(), // TODO: сделать опциональным
  //   alertId: alert.id,
  //   nickname: "Тестовый алерт",
  //   message: "Тестовое сообщение",
  //   amount: {
  //     major: 100,
  //     minor: 0,
  //     currency: "RUB",
  //   },
  // });
}

const TwitchAlertItemComponent = observer(
  ({
    property,
    index,
    alert,
  }: {
    property: TwitchAlertsProperty;
    index: number;
    alert: TwitchAlertData;
  }) => {
    const { conf } = useLoaderData() as WidgetData;
    const selection = useContext(SelectedIndexContext);
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [contentDialogState] = useState<ModalState>(
      () =>
        new ModalState(parentModalState, () => {}, selection.id === alert.id),
    );

    return (
      <ModalStateContext.Provider value={contentDialogState}>
        <ListItem
          first={<div className={`${classes.goaltitle}`}>{alert.name}</div>}
          second={
            <Flex align="center" justify="flex-end" gap={3}>
              <SubActionButton
                onClick={() => testAlert(conf.topic.twitch, alert)}
              >
                <div>Тест</div>
              </SubActionButton>
              <BorderedIconButton
                onClick={() => {
                  property.copyAlert(index);
                }}
              >
                <CopyIcon />
              </BorderedIconButton>
              <ModalStateContext.Provider value={deleteDialogState}>
                <Overlay>
                  <Warning
                    action={() => {
                      deleteDialogState.show = false;
                      property.deleteAlert(index);
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
            selection.id = alert.id;
            contentDialogState.show = true;
          }}
        />
        <Overlay>
          <FullscreenPanel>
            <ItemContent alert={alert} property={property} index={index} />
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
          {property.value.map((alert: TwitchAlertData, index: number) => (
            <TwitchAlertItemComponent
              property={property}
              index={index}
              alert={alert}
            />
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
      value: [
        {
          id: uuidv7(),
          name: TWITCH_ALERT_DEFAULT_NAME,
          triggers: [],
        },
      ],
      displayName: "Оповещения",
    });
  }

  addAlert() {
    this.value.push({
      id: uuidv7(),
      name: TWITCH_ALERT_DEFAULT_NAME,
      enabled: true,
      triggers: [],
      audio: [],
    });
    log.debug({ settings: this }, "updated twitch alerts");
  }

  deleteAlert(index: number) {
    this.value.splice(index, 1);
    log.debug({ settings: this }, "updated twitch alerts");
  }

  updateAlert(index: number, alert: TwitchAlertData) {
    this.value.splice(index, 1, alert);
    log.debug({ settings: this }, "updated twitch alerts");
  }

  copyAlert(index: number) {
    const alert = this.value[index];
    this.value.push({
      id: uuidv7(),
      name: alert.name,
      enabled: alert.enabled,
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
