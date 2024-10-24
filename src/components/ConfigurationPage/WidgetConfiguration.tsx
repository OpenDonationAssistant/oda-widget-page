import React, { useContext, useRef } from "react";
import axios from "axios";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";
import TestAlertButton from "./settings/TestAlertButton";

import { publish, socket } from "../../socket";
import { log } from "../../logging";
import { Button, Flex, Input, Modal } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import Dropdown from "antd/es/dropdown/dropdown";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { ApiContext } from "../../contexts/ApiContext";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { makeAutoObservable } from "mobx";
import { SelectionContext } from "./ConfigurationPage";
import DonatersTopList from "../DonatersTopList/DonatersTopList";
import DonationGoal from "../DonationGoal/DonationGoal";
import DonationTimer from "../DonationTimer/DonationTimer";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";

interface WidgetConfigurationProps {
  widget: Widget;
  open: boolean;
}

function getWidget(type: string) {
  switch (type) {
    case "donaters-top-list":
      return <DonatersTopList />;
    case "donationgoal":
      return <DonationGoal />;
    case "donation-timer":
      return <DonationTimer />;
    case "player-info":
      return <PlayerInfo />;
    default:
      return <div></div>;
  }
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
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "copy-url",
                label: t("button-copy-url"),
                onClick: () => widget.url(),
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
      </div>
      <div className={`widget-settings ${open ? "" : "visually-hidden"}`}>
        {widget.type === "testtype" && (
          <Flex justify="space-around" className={`${classes.preview}`}>
            <ResizableBox
              width={800}
              height={250}
              style={{
                border: "1px solid black",
                boxShadow: "0px 0px 4px 4px #111111",
                marginBottom: "10px",
                background: `url(${process.env.PUBLIC_URL}/opacity.png)`,
              }}
              axis="both"
              minConstraints={[650, 100]}
            >
              <WidgetSettingsContext.Provider
                value={{
                  widgetId: widget.id,
                  settings: {
                    config: widget.config,
                  },
                  subscribe: (
                    topic: string,
                    onMessage: (params: {
                      ack: () => void;
                      body: string;
                    }) => void,
                  ) => {
                    if (topic === conf.topic.player) {
                      log.debug("sending mock message");
                      onMessage({
                        ack: () => {},
                        body: JSON.stringify({
                          title:
                            "IZANAGI 【 イザナギ 】 ☯ Japanese Trap & Bass Type Beat ☯ Trapanese Lofi Hip Hop Mix",
                          owner: "testuser",
                          count: 11,
                          number: 0,
                        }),
                      });
                    }
                  },
                  unsubscribe: (topic: string) => {},
                  publish: (topic: string, payload: any) => {},
                }}
              >
                <ApiContext.Provider
                  value={{
                    listDonaters: (period: string) =>
                      axios
                        .get(
                          `${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/recipients/${recipientId}/donaters?period=${period}`,
                        )
                        .then((response) => response.data),
                  }}
                >
                  {getWidget(widget.type)}
                </ApiContext.Provider>
              </WidgetSettingsContext.Provider>
            </ResizableBox>
          </Flex>
        )}
        <Comp widget={widget} />
      </div>
    </div>
  );
}
