import React, { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import ColorPicker from "./ColorPicker";
import FontSelect from "./FontSelect";

export default function BaseSettings({
  id,
  onChange,
  customHandler,
}: {
  id: string;
  onChange: Function;
  customHandler?: Function;
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
          {(!prop.type || prop.type == "string") && (
            <input
              value={prop.value}
              className="widget-settings-value"
              onChange={(e) => update(prop.name, e.target.value)}
            />
          )}
          {prop.type === "fontselect" && (
            <FontSelect
              prop={prop}
              onChange={(value) => update(prop.name, value)}
            />
          )}
          {prop.type === "color" && (
            <ColorPicker
              value={prop.value}
              onChange={(value) => update(prop.name, value)}
            />
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
          {prop.type === "custom" && customHandler ? customHandler(prop) : <></>}
        </div>
      ))}
    </>
  );
}
