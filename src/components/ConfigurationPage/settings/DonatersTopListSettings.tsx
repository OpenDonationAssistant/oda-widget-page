import React, { ChangeEvent, useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import ColorPicker from "./ColorPicker";
import BaseSettings from "./BaseSettings";

const fonts = [
  "Roboto",
  "Ruslan Display",
  "Cuprum",
  "Anonymous Pro",
  "Pangolin",
  "Ruda",
  "Stalinist One",
  "Montserrat",
  "Ubuntu Mono",
  "Jura",
  "Scada",
  "Prosto One",
  "Arsenal",
  "Tenor Sans",
  "El Messiri",
  "Yeseva One",
  "Pattaya",
  "Andika",
  "Gabriela",
  "Marmelad",
  "Cormorant Unicase",
  "Cormorant SC",
  "Amatic SC",
  "Rubik Mono One",
  "PT Sans Caption",
  "Spectral SC",
  "Rubik",
  "Exo 2",
  "Exo",
  "Oswald",
  "Underdog",
  "Kurale",
  "Forum",
  "Neucha",
  "Didact Gothic",
  "Philosopher",
  "Russo One",
  "Noto Serif",
];

export default function DonatersTopListSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, setConfig } = useContext(WidgetsContext);

  function update(key: string, value: string) {
    setConfig((oldConfig) => {
      let updatedProperties = oldConfig.get(id)?.properties.map((it) => {
        if (it.name === key) {
          it.value = value;
        }
        return it;
      });
      return new Map(oldConfig).set(id, { properties: updatedProperties });
    });
    onChange.call({});
  }

  return (
    <>
      <BaseSettings id={id} onChange={onChange}/>
      {config.get(id)?.properties?.map((prop) => (
        <>
        {prop.type === "custom" && (
        <div key={prop.name} className="widget-settings-item">
          <label className="widget-settings-name">{prop.displayName}</label>
          {prop.name === "type" && (
            <select
              value={prop.value}
              className="widget-settings-value select"
              onChange={(e) => update(prop.name, e.target.value)}
            >
              <option key="All">All</option>
              <option key="Top">Top</option>
              <option key="Last">Last</option>
            </select>
          )}
          {prop.name === "period" && (
            <select
              value={prop.value}
              className="widget-settings-value select"
              onChange={(e) => update(prop.name, e.target.value)}
            >
              <option key="month">month</option>
              <option key="day">day</option>
            </select>
          )}
          {prop.name === "layout" && (
            <>
              <div className="widget-settings-radiocontainer">
                <label className="widget-settings-radiobutton">
                  <input
                    title="vertical"
                    type="radio"
                    value="vertical"
                    checked={prop.value === "vertical"}
                    onChange={(e) => update(prop.name, e.target.value)}
                  />
                  <img
                    title="vertical"
                    src={`/icons/vertical.jpg`}
                    onClick={() => update(prop.name, "vertical")}
                  />
                </label>
                <label className="widget-settings-radiobutton">
                  <input
                    title="horizontal"
                    type="radio"
                    value="horizontal"
                    checked={prop.value === "horizontal"}
                    onChange={(e) => update(prop.name, e.target.value)}
                  />
                  <img
                    title="horizontal"
                    src={`/icons/horizontal.jpg`}
                    onClick={() => update(prop.name, "horizontal")}
                  />
                </label>
              </div>
            </>
          )}
        </div>
        )}
        </>
      ))
      }
    </>
  );
}
