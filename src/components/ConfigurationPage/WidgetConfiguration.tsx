import { useContext, useEffect, useRef, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";

import { publish, socket } from "../../socket";
import { Button, Flex, Input, Modal as AntModal, notification } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Trans, useTranslation } from "react-i18next";
import Dropdown from "antd/es/dropdown/dropdown";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { makeAutoObservable, reaction } from "mobx";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";
import WidgetUrlModal from "./WidgetUrlModal";
import DonatonWidget from "../../pages/Donaton/DonatonWidget";
import { DonatonWidgetSettings } from "./widgetsettings/donaton/DonatonWidgetSettings";
import DonationTimer from "../../pages/DonationTimer/DonationTimer";
import { DonationTimerWidgetSettings } from "./widgetsettings/DonationTimerWidgetSettings";
import { PlayerPopupWidgetSettings } from "./widgetsettings/PlayerPopupWidgetSettings";
import PlayerPopup from "../PlayerPopup/PlayerPopup";
import { DemoPlayerStore } from "../PlayerPopup/DemoPlayer";
import { DonationGoal } from "../DonationGoal/DonationGoal";
import { DemoDonationGoalState } from "../DonationGoal/DemoDonationGoalState";
import { DonationGoalWidgetSettings } from "./widgetsettings/DonationGoalWidgetSettings";
import { DonatersTopList } from "../../pages/DonatersTopList/DonatersTopList";
import { DonatersTopListWidgetSettings } from "./widgetsettings/DonatersTopListWidgetSettings";
import { DemoListStore } from "../../pages/DonatersTopList/DemoListStore";
import { getRndInteger } from "../../utils";
import { SelectedIndexContext } from "../../stores/SelectedIndexStore";
import { WidgetStoreContext } from "../../stores/WidgetStore";
import TestAlertPopup from "../TestAlertPopup/TestAlertPopup";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Subtitle,
  Title,
} from "../Overlay/Overlay";
import CloseIcon from "../../icons/CloseIcon";
import IconButton from "../IconButton/IconButton";
import SecondaryButton from "../SecondaryButton/SecondaryButton";

interface WidgetConfigurationProps {
  widget: Widget;
}

export const SaveButtons = observer(({ widget }: { widget: Widget }) => {
  const { t } = useTranslation();

  return (
    <>
      {widget.config.unsaved && (
        <>
          <button
            className="oda-btn-default widget-button-accept"
            onClick={() => {
              widget.save().then(() => {
                socket.publish({
                  destination: "/topic/commands",
                  body: JSON.stringify({
                    id: widget.id,
                    command: "reload",
                  }),
                });
              });
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">save</span>
              <div className="blinker">{t("button-save")}</div>
            </Flex>
          </button>
          <button
            className="oda-btn-default widget-button-decline"
            onClick={() => {
              widget.reload();
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">cancel</span>
              <div className="blinker">{t("button-cancel")}</div>
            </Flex>
          </button>
        </>
      )}
    </>
  );
});

export const HelpButton = observer(({ widget }: { widget: Widget }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => {
    setShowModal((old) => !old);
  };

  return (
    <>
      <AntModal
        className={`${classes.helpmodal}`}
        title="Help"
        open={showModal}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={toggleModal}
      >
        {widget.config.help()}
      </AntModal>
      <button className={`${classes.helpbutton}`} onClick={toggleModal}>
        <span className="material-symbols-sharp">help</span>
      </button>
    </>
  );
});

const NameComponent = observer(({ widget }: { widget: Widget }) => {
  const [modalState] = useState<ModalState>(new ModalState());

  return (
    <ModalStateContext.Provider value={modalState}>
      <div
        className="widget-header-toogler"
        onClick={() => {
          modalState.show = true;
        }}
      >
        <img className="widget-icon" src={`/icons/${widget.type}.png`} />
        <div className="widget-title">{widget.name}</div>
      </div>
      <Overlay>
        <Panel>
          <Title>
            <Flex justify="space-between">
              <div>{widget.name}</div>
              <div>
                <IconButton
                  onClick={() => {
                    modalState.show = false;
                  }}
                >
                  <CloseIcon color="var(--oda-color-1000)" />
                </IconButton>
              </div>
            </Flex>
          </Title>
          <Subtitle className={`${classes.settingssubtitle}`}>
            Настройки виджета
          </Subtitle>
          {(widget.type === "donaton" ||
            widget.type === "donation-timer" ||
            widget.type === "donationgoal" ||
            widget.type === "player-popup" ||
            widget.type === "donaters-top-list") && (
            <Flex justify="space-around" className={`${classes.preview}`}>
              <ResizableBox
                height={250}
                className={`${classes.resizable}`}
                axis="both"
                minConstraints={[650, 100]}
              >
                <div style={{ maxWidth: "100%" }}>
                  {widget.type === "donation-timer" && (
                    <DonationTimer
                      settings={widget.config as DonationTimerWidgetSettings}
                    />
                  )}
                  {widget.type === "donaton" && (
                    <DonatonWidget
                      settings={widget.config as DonatonWidgetSettings}
                    />
                  )}
                  {widget.type === "player-popup" && (
                    <PlayerPopup
                      player={new DemoPlayerStore()}
                      settings={widget.config as PlayerPopupWidgetSettings}
                    />
                  )}
                  {widget.type === "donationgoal" && (
                    <DonationGoal
                      settings={widget.config as DonationGoalWidgetSettings}
                      state={
                        new DemoDonationGoalState(
                          widget.config as DonationGoalWidgetSettings,
                        )
                      }
                    />
                  )}
                  {widget.type === "donaters-top-list" && (
                    <DonatersTopList
                      settings={widget.config as DonatersTopListWidgetSettings}
                      store={new DemoListStore()}
                    />
                  )}
                </div>
              </ResizableBox>
            </Flex>
          )}
          <Comp widget={widget} />
        </Panel>
      </Overlay>
    </ModalStateContext.Provider>
  );
});

class RenameModalState {
  private _open: boolean = false;
  private _name: string;
  private _widget: Widget;

  constructor(widget: Widget) {
    this._widget = widget;
    this._name = widget.name;
    makeAutoObservable(this);
  }

  public show(): void {
    this._open = true;
  }

  public reset(): void {
    this._name = this._widget.name;
    this._open = false;
  }

  public apply(): void {
    this._widget.rename(this._name);
    this._open = false;
  }

  public get open(): boolean {
    return this._open;
  }
  public set open(value: boolean) {
    this._open = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}

// TODO: localize
const RenameModal = observer(({ state }: { state: RenameModalState }) => {
  return (
    <AntModal
      title={"Rename"}
      open={state.open}
      onOk={() => state.apply()}
      onClose={() => state.reset()}
      onCancel={() => state.reset()}
    >
      <div className="settings-item">
        <LabeledContainer displayName="Rename">
          <Input
            value={state.name}
            onChange={(e) => (state.name = e.target.value)}
          />
        </LabeledContainer>
      </div>
    </AntModal>
  );
});

const Comp = observer(({ widget }: { widget: Widget }) => (
  <> {widget.config.markup()} </>
));

function getProperty(config: AbstractWidgetSettings, name: string): any {
  return config.get(name)?.value;
}

function runReel(id: string, conf: any, config: AbstractWidgetSettings) {
  const optionList = getProperty(config, "optionList");
  const choosenIndex = getRndInteger(0, optionList.length - 1);
  publish(conf.topic.reel, {
    type: "trigger",
    selection: optionList[choosenIndex],
    widgetId: id,
  });
}

export const WidgetConfiguration = observer(
  ({ widget }: WidgetConfigurationProps) => {
    const store = useContext(WidgetStoreContext);
    const selection = useContext(SelectedIndexContext);
    const { conf } = useLoaderData() as WidgetData;
    const { t } = useTranslation();
    const renameModalState = useRef(new RenameModalState(widget));
    const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
    const [api, context] = notification.useNotification();

    useEffect(() => {
      reaction(
        () => widget.config.unsaved,
        (unsaved) => {
          if (unsaved) {
            api.warning({
              key: widget.id,
              message: <Trans i18nKey="unsaved-notification-title" />,
              description: (
                <Flex vertical gap={15} className="full-width">
                  <div>
                    <Trans i18nKey="unsaved-notification-description" />
                    <span className={`${classes.widgetname}`}>
                      {widget.name}
                    </span>
                  </div>
                  <Flex>
                    <SaveButtons widget={widget} />
                  </Flex>
                </Flex>
              ),
              placement: "bottomRight",
              duration: 0,
            });
          } else {
            api.destroy();
          }
        },
      );
    }, [widget]);

    return (
      <div
        className={`widget ${selection.id === widget.id ? "extended" : "collapsed"}`}
      >
        {context}
        <RenameModal state={renameModalState.current} />
        <div className="widget-header">
          <NameComponent widget={widget} />
          {widget.type === "reel" && (
            <SecondaryButton
              onClick={() => runReel(widget.id, conf, widget.config)}
            >
              <span className="material-symbols-sharp">poker_chip</span>
              <div>{t("button-spin")}</div>
            </SecondaryButton>
          )}
          {widget.type === "payment-alerts" && <TestAlertPopup config={conf} />}
          <SaveButtons widget={widget} />
          <WidgetUrlModal
            open={showUrlModal}
            type={widget.type}
            id={widget.id}
            onClose={() => setShowUrlModal(false)}
          />
          <HelpButton widget={widget} />
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "copy-url",
                  label: (
                    <Flex gap={5}>
                      <span className="material-symbols-sharp">link</span>
                      <span>{t("button-copy-url")}</span>
                    </Flex>
                  ),
                  onClick: () => setShowUrlModal(true),
                },
                {
                  key: "rename",
                  label: (
                    <Flex gap={5}>
                      <span className="material-symbols-sharp">stylus</span>
                      <span>{t("button-rename")}</span>
                    </Flex>
                  ),
                  onClick: () => {
                    renameModalState.current.show();
                  },
                },
                {
                  key: "copy-widget",
                  label: (
                    <Flex gap={5}>
                      <span className="material-symbols-sharp">
                        content_copy
                      </span>
                      <span>{t("button-copy-widget")}</span>
                    </Flex>
                  ),
                  onClick: () => {
                    if (widget.type !== "payment-alerts") {
                      widget.copy();
                    }
                  },
                },
                {
                  key: "delete",
                  label: (
                    <Flex gap={5}>
                      <span className="material-symbols-sharp">delete</span>
                      <span>{t("button-delete")}</span>
                    </Flex>
                  ),
                  onClick: () => widget.delete(),
                },
              ],
            }}
          >
            <button onClick={(e) => e.preventDefault()} className="menu-button">
              <span className="material-symbols-sharp">more_vert</span>
            </button>
          </Dropdown>
        </div>
      </div>
    );
  },
);
