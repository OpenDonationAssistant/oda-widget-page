import React, { useContext, useRef, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";
import TestAlertButton from "./settings/TestAlertButton";

import { publish, socket } from "../../socket";
import { Button, Flex, Input, Modal } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import Dropdown from "antd/es/dropdown/dropdown";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { makeAutoObservable } from "mobx";
import { SelectionContext } from "./ConfigurationPage";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";
import WidgetUrlModal from "./WidgetUrlModal";
import DonatonWidget from "../../pages/Donaton/DonatonWidget";
import {
  DonatonWidgetSettings,
  DonatonWidgetSettingsContext,
} from "./widgetsettings/donaton/DonatonWidgetSettings";
import DonationTimer from "../../pages/DonationTimer/DonationTimer";
import {
  DonationTimerWidgetSettings,
  DonationTimerWidgetSettingsContext,
} from "./widgetsettings/DonationTimerWidgetSettings";
import {
  PlayerPopupWidgetSettings,
  PlayerPopupWidgetSettingsContext,
} from "./widgetsettings/PlayerPopupWidgetSettings";
import PlayerPopup from "../PlayerPopup/PlayerPopup";
import { DemoPlayerStore } from "../PlayerPopup/DemoPlayer";

interface WidgetConfigurationProps {
  widget: Widget;
  open: boolean;
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
            <div className="blinker">{t("button-save")}</div>
          </button>
          <button
            className="widget-button widget-button-decline"
            onClick={() => {
              widget.reload();
            }}
          >
            <div className="blinker">{t("button-cancel")}</div>
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

export default function WidgetConfiguration({
  widget,
  open,
}: WidgetConfigurationProps) {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const { t } = useTranslation();
  const renameModalState = useRef(new RenameModalState(widget));
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);

  return (
    <div className={`widget ${open ? "extended" : "collapsed"}`}>
      <RenameModal state={renameModalState.current} />
      <div className="widget-header">
        <NameComponent widget={widget} />
        {widget.type === "reel" && (
          <Button
            onClick={() => runReel(widget.id, conf, widget.config)}
            className="oda-btn-default"
          >
            {t("button-spin")}
          </Button>
        )}
        {widget.type === "payment-alerts" && <TestAlertButton config={conf} />}
        <SaveButtons widget={widget} />
        <WidgetUrlModal
          open={showUrlModal}
          type={widget.type}
          id={widget.id}
          onClose={() => setShowUrlModal(false)}
        />
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "copy-url",
                label: t("button-copy-url"),
                onClick: () => setShowUrlModal(true),
              },
              {
                key: "rename",
                label: t("button-rename"),
                onClick: () => {
                  renameModalState.current.show();
                },
              },
              {
                key: "delete",
                label: t("button-delete"),
                onClick: () => widget.delete(),
              },
            ],
          }}
        >
          <button onClick={(e) => e.preventDefault()} className="menu-button">
            <span className="material-symbols-sharp">more_vert</span>
          </button>
        </Dropdown>
        <HelpButton widget={widget} />
      </div>
      <div className={`widget-settings ${open ? "" : "visually-hidden"}`}>
        {(widget.type === "donaton" ||
          widget.type === "donation-timer" ||
          widget.type === "player-popup") && (
          <Flex justify="space-around" className={`${classes.preview}`}>
            <ResizableBox
              width={800}
              height={250}
              className={`${classes.resizable}`}
              axis="both"
              minConstraints={[650, 100]}
            >
              {widget.type === "donation-timer" && (
                <DonationTimerWidgetSettingsContext.Provider
                  value={widget.config as DonationTimerWidgetSettings}
                >
                  <DonationTimer />
                </DonationTimerWidgetSettingsContext.Provider>
              )}
              {widget.type === "donaton" && (
                <DonatonWidgetSettingsContext.Provider
                  value={widget.config as DonatonWidgetSettings}
                >
                  <DonatonWidget />
                </DonatonWidgetSettingsContext.Provider>
              )}
              {widget.type === "player-popup" && (
                <PlayerPopupWidgetSettingsContext.Provider
                  value={widget.config as PlayerPopupWidgetSettings}
                >
                  <PlayerPopup player={new DemoPlayerStore()} />
                </PlayerPopupWidgetSettingsContext.Provider>
              )}
            </ResizableBox>
          </Flex>
        )}
        <Comp widget={widget} />
      </div>
    </div>
  );
}
