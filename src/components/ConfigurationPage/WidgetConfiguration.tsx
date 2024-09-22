import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";

import { WidgetsContext } from "./WidgetsContext";
import { publish, socket } from "../../socket";
import { log } from "../../logging";
import { Button, Flex } from "antd";
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

interface WidgetConfigurationProps {
  id: string;
  name: string;
  type: string;
  reload: Function;
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

function deleteWidget(id: string) {
  return axios.delete(
    `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${id}`,
  );
}

async function copyUrl(type: string, id: string) {
  const tokens = await tokenRequest({
    refreshToken: localStorage.getItem("refresh-token") ?? "",
  });
  navigator.clipboard.writeText(
    `${process.env.REACT_APP_ENDPOINT}/${type}/${id}?refresh-token=${tokens.refreshToken}`,
  );
}

export default function WidgetConfiguration({
  id,
  name,
  type,
  reload,
}: WidgetConfigurationProps) {
  const { config, setConfig, updateConfig } = useContext(WidgetsContext);
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const [settingsHidden, setSettingsHidden] = useState<boolean>(true);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const context = {
    config: config,
    setConfig: (newConfig: Map<string, AbstractWidgetSettings>) => {
      setConfig(newConfig);
      setHasChanges(true);
    },
    updateConfig: update,
  };

  const { t } = useTranslation();

  function update(id: string, key: string, value: any) {
    updateConfig(id, key, value);
    setHasChanges(true);
  }

  function toggleSettings() {
    setSettingsHidden(!settingsHidden);
  }

  function saveSettings() {
    const settings = config.get(id);
    log.debug({ id: id, settings: settings }, "saving settings");
    const props = settings?.properties.map((prop) => {
      return {
        name: prop.name,
        value: prop.value,
      };
    });
    log.debug({ updated: props }, "sending props");
    const request = {
      name: newName,
      config: {
        properties: props,
        alerts: settings?.alerts,
      },
    };
    return axios.patch(
      `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${id}`,
      request,
    );
  }

  function getProperty(name: string): any {
    return config.get(id)?.properties.find((prop) => prop.name === name)?.value;
  }

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function runReel() {
    const optionList = getProperty("optionList");
    const choosenIndex = getRndInteger(0, optionList.length - 1);
    publish(conf.topic.reel, {
      type: "trigger",
      selection: optionList[choosenIndex],
      widgetId: id,
    });
  }

  return (
    <div className={`widget ${settingsHidden ? "collapsed" : "extended"}`}>
      <div className="widget-header">
        <div className="widget-header-toogler" onClick={toggleSettings}>
          <img className="widget-icon" src={`/icons/${type}.png`} />
          {!renaming && <div className="widget-title">{name}</div>}
          {renaming && (
            <input
              onChange={(e) => setNewName(e.target.value)}
              className="new-name-input"
              value={newName}
            />
          )}
        </div>
        {!hasChanges && type === "reel" && (
          <Button onClick={runReel} className="oda-btn-default">
            {t("button-spin")}
          </Button>
        )}
        {!hasChanges && type === "payment-alerts" && (
          <TextAlertButton config={config} />
        )}
        {hasChanges && (
          <>
            <button
              className="widget-button widget-button-accept"
              onClick={() => {
                setHasChanges(false);
                setRenaming(false);
                saveSettings().then((ignore) => reload.apply({}));
                socket.publish({
                  destination: "/topic/commands",
                  body: JSON.stringify({
                    id: id,
                    command: "reload",
                  }),
                });
              }}
            >
              <div className="blinker">{t("button-save")}</div>
            </button>
            <button
              className="widget-button widget-button-decline"
              onClick={() => {
                setHasChanges(false);
                setRenaming(false);
                reload.apply({});
              }}
            >
              <div className="blinker">{t("button-cancel")}</div>
            </button>
          </>
        )}
        {!hasChanges && (
          <>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "copy-url",
                    label: t("button-copy-url"),
                    onClick: () => copyUrl(type, id),
                  },
                  {
                    key: "rename",
                    label: t("button-rename"),
                    onClick: () => {
                      setRenaming(true);
                      setHasChanges(true);
                    },
                  },
                  {
                    key: "delete",
                    label: t("button-delete"),
                    onClick: () => {
                      deleteWidget(id).then(() => reload.apply({}));
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
      <div
        className={`widget-settings ${settingsHidden ? "visually-hidden" : ""}`}
      >
        {(type === "donaters-top-list" ||
          type === "donationgoal" ||
          type === "player-info" ||
          type === "donation-timer") && (
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
              {config.get(id) && (
                <WidgetSettingsContext.Provider
                  value={{
                    widgetId: id,
                    settings: {
                      config:
                        config.get(id) ??
                        new AbstractWidgetSettings(id, [], [], new Map()),
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
                    {getWidget(type)}
                  </ApiContext.Provider>
                </WidgetSettingsContext.Provider>
              )}
            </ResizableBox>
          </Flex>
        )}
        <WidgetsContext.Provider value={context}>
          {config.get(id)?.markup()}
        </WidgetsContext.Provider>
      </div>
    </div>
  );
}
