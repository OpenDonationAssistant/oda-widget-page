import React, { useEffect, useState } from "react";
import WidgetConfiguration from "./WidgetConfiguration";
import Toolbar, { Page } from "./Toolbar";
import { WidgetsContext } from "./WidgetsContext";
import axios from "axios";
import { useLoaderData } from "react-router";
import { defaultSettings } from "./WidgetSettings";

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
    .then((data) => data.sort((a, b) => a.sortOrder - b.sortOrder));
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
];

export default function ConfigurationPage({}: {}) {
  const [config, setConfig] = useState(new Map());
	
  function updateConfig(id: string, key: string, value) {
    setConfig((oldConfig) => {
      let updatedProperties = oldConfig.get(id)?.properties.map((it) => {
        if (it.name === key) {
          it.value = value;
        }
        return it;
      });
			console.log(updatedProperties);
      return new Map(oldConfig).set(id, { properties: updatedProperties });
    });
  }


  const context = { config, setConfig, updateConfig };
  const [showAddWidgetPopup, setShowAddWidgetPopup] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const { recipientId, settings, conf } = useLoaderData();

  function load() {
    loadSettings().then((widgets) => setWidgets(widgets));
  }

  useEffect(() => {
    load();
  }, [recipientId]);

  useEffect(() => {
    let widgetSettings = new Map();

    widgets.forEach((it) => {
      const settings = defaultSettings[it.type];
      const mergedSettings = settings.properties.map((prop) => {
				const value = it.config?.properties?.find((sameprop) => sameprop.name === prop.name)?.value;
				if (value != null){
				  prop.value = value;
				}
				return prop;
      });
			if (it.config) {
				it.config.properties = mergedSettings;
			}
      widgetSettings.set(it.id, it.config);
    });

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
      <Toolbar page={Page.WIDGETS}/>
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
                    .then((ignore) => loadSettings())
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
