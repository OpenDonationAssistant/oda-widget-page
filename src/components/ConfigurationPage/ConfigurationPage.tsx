import React, { useEffect, useState } from "react";
import WidgetConfiguration from "./WidgetConfiguration";
import Toolbar, { Page } from "./Toolbar";
import { WidgetsContext } from "./WidgetsContext";
import axios from "axios";
import { useLoaderData } from "react-router";
import {
  AbstractWidgetSettings,
  DonatersTopListWidgetSettings,
  DonationTimerWidgetSettings,
  EmptyWidgetSettings,
  MediaWidgetSettings,
  PaymentAlertsWidgetSettings,
  PaymentsWidgetSettings,
  PlayerInfoWidgetSettings,
  PlayerPopupWidgetSettings,
  ReelWidgetSettings,
} from "./WidgetSettings";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import { WidgetSettings } from "../../types/WidgetSettings";

const backgroundColor = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html, body {background-color: #0c122e; height: 100%;}`,
    }}
  />
);

function loadSettings() {
  return axios
    .get(`${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets`)
    .then((data) => data.data)
    .then((data: WidgetSettings[]) =>
      data.sort((a, b) => a.sortOrder - b.sortOrder)
    );
}

function addWidget(type: string, total: number) {
  return axios.put(`${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets`, {
    type: type,
    sortOrder: total,
  });
}

const types = [
  { name: "payment-alerts", description: "Payment Alerts" },
  { name: "media", description: "Music Player" },
  { name: "player-info", description: "Music Player Info" },
  { name: "donaters-top-list", description: "Donaters List" },
  { name: "payments", description: "Payment History" },
  { name: "player-control", description: "Music Player Remote Control" },
  { name: "donation-timer", description: "Donation Timer" },
  { name: "player-popup", description: "Video Popup" },
  { name: "reel", description: "Roulette" },
];

export default function ConfigurationPage({}: {}) {
  const [config, setConfig] = useState<Map<string, AbstractWidgetSettings>>(
    new Map(),
  );
  const context = { config, setConfig, updateConfig };
  const [showAddWidgetPopup, setShowAddWidgetPopup] = useState(false);
  const [widgets, setWidgets] = useState<WidgetSettings[]>([]);
  const { recipientId } = useLoaderData() as WidgetData;

  function updateConfig(id: string, key: string, value: any) {
    setConfig((oldConfig) => {
      const widgetSettings = oldConfig.get(id) ?? new EmptyWidgetSettings([]);
      let updatedProperties = widgetSettings?.properties.map((it) => {
        if (it.name === key) {
          it.value = value;
        }
        return it;
      });
      log.debug(`updated properties: ${JSON.stringify(updatedProperties)}`);
      widgetSettings.properties = updatedProperties;
      log.debug(`updated widget setting: ${JSON.stringify(widgetSettings)}`);
      return new Map(oldConfig).set(id, widgetSettings);
    });
  }

  function load() {
    loadSettings().then((widgets) => setWidgets(widgets));
  }

  useEffect(() => {
    load();
  }, [recipientId]);

  function createSettings(savedSettings: WidgetSettings) {
    switch (savedSettings.type) {
      case "donaters-top-list": {
        return new DonatersTopListWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "donation-timer": {
        return new DonationTimerWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "media": {
        return new MediaWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "player-control": {
        return new EmptyWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "player-popup": {
        return new PlayerPopupWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "payments": {
        return new PaymentsWidgetSettings(
          savedSettings.config.properties,
        );
      }
      case "payment-alerts": {
        return new PaymentAlertsWidgetSettings(
          savedSettings.config.properties,
          savedSettings.config.alerts ?? [],
        );
      }
      case "player-info": {
        return new PlayerInfoWidgetSettings(
          savedSettings.config.properties
        );
      }
      case "reel": {
        return new ReelWidgetSettings(
          savedSettings.config.properties
        );
      }
      default: {
        return new EmptyWidgetSettings(savedSettings.config.properties);
      }
    }
  }

  useEffect(() => {
    let widgetSettings = new Map();

    widgets.forEach((it) => {
      widgetSettings.set(it.id, createSettings(it).copy());
    });

    log.debug({ settings: widgetSettings}, "loaded widget settings");

    setConfig(widgetSettings);
  }, [widgets]);

  const newWidgetMock = (
    <div
      className="widget new-widget-mock"
      onClick={() => setShowAddWidgetPopup(!showAddWidgetPopup)}
      style={{
        marginTop: "60px",
        display: "block",
        textAlign: "center",
        border: "none",
        paddingTop: "15px",
        paddingBottom: "15px",
      }}
    >
      <div className="widget-title">
        <span className="material-symbols-sharp">add</span>
      </div>
    </div>
  );

  return (
    <div className="configuration-container">
      {backgroundColor}
      <Toolbar page={Page.WIDGETS} />
      <div className="widget-list">
        <WidgetsContext.Provider value={context}>
          {widgets.map((data) => (
            <WidgetConfiguration
              id={data.id}
              key={data.id}
              name={data.name}
              type={data.type}
              reload={() => {
                load();
              }}
            />
          ))}
          {!showAddWidgetPopup && newWidgetMock}
        </WidgetsContext.Provider>
        {showAddWidgetPopup && (
          <div className="new-widget-popup">
            {types.map((type) => (
              <div
                className="new-widget-type-button"
                onClick={() => {
                  addWidget(type.name, widgets.length)
                    .then(() => loadSettings())
                    .then((updatedSettings) => setWidgets(updatedSettings));
                  setShowAddWidgetPopup(false);
                }}
              >
                <img className="widget-icon" src={`/icons/${type.name}.png`} />
                <div>{type.description}</div>
              </div>
            ))}
            <div
              className="new-widget-type-button"
              onClick={() => setShowAddWidgetPopup(false)}
              style={{ border: "none", paddingTop: "33px" }}
            >
              <img className="widget-icon" src={`/icons/close.png`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
