import React, { useContext, useRef } from "react";
import { useState } from "react";
import axios from "axios";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";

import { WidgetsContext } from "./WidgetsContext";
import { publish, socket } from "../../socket";
import { log } from "../../logging";
import { Button, Flex, Input, Modal } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import TextAlertButton from "./settings/TestAlertButton";
import { useTranslation } from "react-i18next";
import Dropdown from "antd/es/dropdown/dropdown";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { ApiContext } from "../../contexts/ApiContext";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";
import DonatersTopList from "../DonatersTopList/DonatersTopList";
import { ResizableBox } from "react-resizable";
import DonationGoal from "../DonationGoal/DonationGoal";
import DonationTimer from "../DonationTimer/DonationTimer";
import classes from "./WidgetConfiguration.module.css";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import { tokenRequest } from "../Login/Login";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { makeAutoObservable } from "mobx";
import { SelectionContext } from "./ConfigurationPage";

interface WidgetConfigurationProps {
  widget: Widget;
  open: boolean;
}

function getWidget(type: string) {
  switch (type) {
    // case "donaters-top-list":
    //   return <DonatersTopList />;
    // case "donationgoal":
    //   return <DonationGoal />;
    // case "donation-timer":
    //   return <DonationTimer />;
    // case "player-info":
    //   return <PlayerInfo />;
    default:
      return <div></div>;
  }
}

function deleteWidget(id: string) {
  return axios.delete(
    `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${id}`,
  );
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
        if (selection.id){
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

export default function WidgetConfiguration({
  widget,
  open,
}: WidgetConfigurationProps) {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const { t } = useTranslation();
  const renameModalState = useRef(new RenameModalState(widget));

  return (
    <div className={`widget ${open ? "extended":"collapsed"}`}>
      <RenameModal state={renameModalState.current} />
      <div className="widget-header">
        <NameComponent widget={widget} />
        <SaveButtons widget={widget} />
        {!widget.config.unsaved && (
          <>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "copy-url",
                    label: t("button-copy-url"),
                    onClick: widget.url,
                  },
                  {
                    key: "rename",
                    label: t("button-rename"),
                    onClick: () => {
                      renameModalState.current.open = true;
                    },
                  },
                  {
                    key: "delete",
                    label: t("button-delete"),
                    onClick: () => {
                      deleteWidget(widget.id).then(() => reload.apply({}));
                    },
                  },
                ],
              }}
            >
              <button
                onClick={(e) => e.preventDefault()}
                className="menu-button"
              >
                <span className="material-symbols-sharp">more_vert</span>
              </button>
            </Dropdown>
          </>
        )}
      </div>
      <div className={`widget-settings ${open ? "" : "visually-hidden"}`}>
        {(widget.type === "donaters-top-list" ||
          widget.type === "donationgoal" ||
          widget.type === "player-info" ||
          widget.type === "donation-timer") && (
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
        {widget.config.markup()}
      </div>
    </div>
  );
}
