import React, { useContext } from "react";
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
          {(!prop.type || prop.type == "string") && (prop.type != "custom") && (
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
            </select>
					)}
					{prop.name === "period" && (
            <select
              value={prop.value}
              className="widget-settings-value select"
              onChange={(e) => update(prop.name, e.target.value)}
            >
              <option key="month">month</option>
              <option key="month">day</option>
            </select>
					)}
        </div>
      ))}
    </>
  );
}
