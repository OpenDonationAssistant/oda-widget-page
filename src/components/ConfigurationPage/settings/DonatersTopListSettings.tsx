import React, { ChangeEvent, useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import ColorPicker from "./ColorPicker";

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
      {config.get(id)?.properties?.map((prop) => (
        <div key={prop.name} className="widget-settings-item">
          <div className="widget-settings-name">{prop.displayName}</div>
          {(!prop.type || prop.type == "string") && prop.type != "custom" && (
            <input
              value={prop.value}
              className="widget-settings-value"
              onChange={(e) => update(prop.name, e.target.value)}
            />
          )}
          {prop.type === "fontselect" && (
            <select
              value={prop.value}
              className="widget-settings-value select"
              onChange={(e) => update(prop.name, e.target.value)}
            >
              {fonts.sort().map((font) => (
                <option key={font}>{font}</option>
              ))}
            </select>
          )}
          {prop.type === "color" && (
            <ColorPicker
              value={prop.value}
              onChange={(value) => update(prop.name, value)}
            />
          )}
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
          {prop.type === "text" && (
            <>
              <textarea
                style={{ width: "100%" }}
                className="widget-settings-value"
                value={prop.value}
                onChange={(e) => update(prop.name, e.target.value)}
              />
            </>
          )}
          {prop.type === "number" && (
            <>
              <input
                value={prop.value}
                type="number"
                className="widget-settings-value"
                onChange={(e) => update(prop.name, e.target.value)}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
}
