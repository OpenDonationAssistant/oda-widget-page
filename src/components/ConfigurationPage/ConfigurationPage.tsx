import React, { useEffect, useState } from "react";
import WidgetConfiguration from "./WidgetConfiguration";
import { WidgetsContext } from "./WidgetsContext";
import axios from "axios";
import { useLoaderData } from "react-router";
import { EmptyWidgetSettings } from "./WidgetSettings";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import { WidgetSettings } from "../../types/WidgetSettings";
import { PlayerPopupWidgetSettings } from "./widgetsettings/PlayerPopupWidgetSettings";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";
import { DonatersTopListWidgetSettings } from "./widgetsettings/DonatersTopListWidgetSettings";
import { DonationTimerWidgetSettings } from "./widgetsettings/DonationTimerWidgetSettings";
import { MediaWidgetSettings } from "./widgetsettings/MediaWidgetSettings";
import { PaymentsWidgetSettings } from "./widgetsettings/PaymentsWidgetSettings";
import { PaymentAlertsWidgetSettings } from "./widgetsettings/PaymentAlertsWidgetSettings";
import { PlayerInfoWidgetSettings } from "./widgetsettings/PlayerInfoWidgetSettings";
import { ReelWidgetSettings } from "./widgetsettings/ReelWidgetSettings";
import { DonationGoalWidgetSettings } from "./widgetsettings/DonationGoalWidgetSettings";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";

function loadSettings() {
  return axios
    .get(`${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets`)
    .then((data) => data.data)
    .then((data: WidgetSettings[]) => {
      const sorted = data.sort((a, b) => a.sortOrder - b.sortOrder);
      log.debug({ settings: data }, "loaded widget settings");
      return sorted;
    });
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
  { name: "donationgoal", description: "Donation Goals" },
];

export default function ConfigurationPage({}: {}) {
  const [config, setConfig] = useState<Map<string, AbstractWidgetSettings>>(
    new Map(),
  );
  const context = { config, setConfig, updateConfig };
  const [showAddWidgetPopup, setShowAddWidgetPopup] = useState(false);
  const [widgets, setWidgets] = useState<WidgetSettings[]>([]);
  const { recipientId } = useLoaderData() as WidgetData;
  const { t } = useTranslation();

  function updateConfig(id: string, key: string, value: any) {
    setConfig((oldConfig) => {
      const widgetSettings =
        oldConfig.get(id) ?? new EmptyWidgetSettings(id, []);
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
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "donation-timer": {
        return new DonationTimerWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "media": {
        return new MediaWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "player-control": {
        return new EmptyWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "player-popup": {
        return new PlayerPopupWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "payments": {
        return new PaymentsWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "payment-alerts": {
        return new PaymentAlertsWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
          savedSettings.config.alerts ?? [],
        );
      }
      case "player-info": {
        return new PlayerInfoWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "reel": {
        return new ReelWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      case "donationgoal": {
        return new DonationGoalWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
      default: {
        return new EmptyWidgetSettings(
          savedSettings.id,
          savedSettings.config.properties,
        );
      }
    }
  }

  useEffect(() => {
    if (!widgets) {
      return;
    }
    if (widgets.length === 0) {
      return;
    }
    let widgetSettings = new Map();

    widgets.forEach((it) => {
      widgetSettings.set(it.id, createSettings(it));
    });

    log.debug({ settings: widgetSettings }, "merged widget settings");

    setConfig(widgetSettings);
  }, [widgets]);

  const newWidgetMock = (
    <div
      className="oda-btn-default"
      onClick={() => setShowAddWidgetPopup(!showAddWidgetPopup)}
      style={{
        marginTop: "20px",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {t("button-addwidget")}
    </div>
  );

  return (
    <Content style={{ overflow: "initial" }}>
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
                <div>{t(type.description)}</div>
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
    </Content>
  );
}
