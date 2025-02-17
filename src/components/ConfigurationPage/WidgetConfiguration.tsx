import { useContext, useEffect, useRef, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";
import TestAlertButton from "./settings/TestAlertButton";

import { publish, socket } from "../../socket";
import { Button, Flex, Input, Modal, notification } from "antd";
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
import { SelectionContext } from "./ConfigurationPage";
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
            className="widget-button widget-button-accept"
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
            className="widget-button widget-button-decline"
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
      <Modal
        className={`${classes.helpmodal}`}
        title="Help"
        open={showModal}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={toggleModal}
      >
        {widget.config.help()}
      </Modal>
      <button className={`${classes.helpbutton}`} onClick={toggleModal}>
        <span className="material-symbols-sharp">help</span>
      </button>
    </>
  );
});

const NameComponent = observer(({ widget }: { widget: Widget }) => {
  const selection = useContext(SelectionContext);
  return (
    <div
      className="widget-header-toogler"
      onClick={() => {
        if (selection.id === widget.id) {
          selection.id = "";
        } else {
          selection.id = widget.id;
        }
      }}
    >
      <img className="widget-icon" src={`/icons/${widget.type}.png`} />
      <div className="widget-title">{widget.name}</div>
    </div>
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
    <Modal
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
    </Modal>
  );
});

const Comp = observer(({ widget }: { widget: Widget }) => (
  <> {widget.config.markup()} </>
));

function getProperty(config: AbstractWidgetSettings, name: string): any {
  return config.get(name)?.value;
}

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
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
    const selection = useContext(SelectionContext);
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
              message: <Trans i18nKey="unsaved-notification-title" />,
              description: <Trans i18nKey="unsaved-notification-description" />,
              placement: "bottomRight",
              duration: 0,
              closeIcon: <div></div>,
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
            <Button
              onClick={() => runReel(widget.id, conf, widget.config)}
              className="oda-btn-default"
            >
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">poker_chip</span>
                <div>{t("button-spin")}</div>
              </Flex>
            </Button>
          )}
          {widget.type === "payment-alerts" && (
            <TestAlertButton config={conf} />
          )}
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
        <div
          className={`widget-settings ${selection.id === widget.id ? "" : "visually-hidden"}`}
        >
          {(widget.type === "donaton" ||
            widget.type === "donation-timer" ||
            widget.type === "donationgoal" ||
            widget.type === "player-popup" ||
            widget.type === "donaters-top-list") && (
            <Flex justify="space-around" className={`${classes.preview}`}>
              <ResizableBox
                width={800}
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
        </div>
      </div>
    );
  },
);
