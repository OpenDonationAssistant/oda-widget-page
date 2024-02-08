import React, { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import ColorPicker from "./ColorPicker";
import FontSelect from "./FontSelect";
import { log } from "../../../logging";
import BooleanPropertyInput from "./properties/BooleanPropertyInput";

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

  function update(key: string, value: any) {
    setConfig((oldConfig) => {
      const widgetSettings = oldConfig.get(id);
      let updatedProperties = widgetSettings?.properties.map((it) => {
        if (it.name === key) {
          it.value = value;
        }
        return it;
      });
      widgetSettings.properties = updatedProperties;
      return new Map(oldConfig).set(id, widgetSettings);
    });
    onChange.call({});
  }

  return (
    <>
      {config.get(id)?.properties?.map((prop) => (
        <div key={prop.name} className="widget-settings-item">
          <label
            htmlFor={`${id}_${prop.name}`}
            className="widget-settings-name"
          >
            {prop.displayName}
          </label>
          {(!prop.type || prop.type == "string") && (
            <input
              id={`${id}_${prop.name}`}
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
            <div className="color-container">
              <ColorPicker
                value={prop.value}
                onChange={(value) => update(prop.name, value)}
              />
            </div>
          )}
          {prop.type === "text" && (
            <>
              <div className="textarea-container">
                <textarea
                  style={{ width: "50%" }}
                  className="widget-settings-value"
                  value={prop.value}
                  onChange={(e) => update(prop.name, e.target.value)}
                />
              </div>
            </>
          )}
          {prop.type === "boolean" && (
            <BooleanPropertyInput
              prop={prop}
              onChange={() => update(prop.name, !prop.value)}
            />
          )}
          {prop.type === "custom" && customHandler ? (
            customHandler(prop)
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
}
