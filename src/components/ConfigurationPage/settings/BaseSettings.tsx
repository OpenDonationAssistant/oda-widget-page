import React, { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import ColorPicker from "./ColorPicker";
import FontSelect from "./FontSelect";
import BooleanPropertyInput from "./properties/BooleanPropertyInput";
import { WidgetProperty } from "../WidgetSettings";

export default function BaseSettings({
  id,
  customHandler,
  propertyFilter,
}: {
  id: string;
  onChange: Function;
  customHandler?: Function;
  propertyFilter?: (prop: WidgetProperty) => boolean;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);

  return (
    <>
      {config
        .get(id)
        ?.properties?.filter((prop) => {
          if (propertyFilter) {
            return propertyFilter(prop);
          } else return true;
        })
        .map(
          (prop) =>
            (prop.type !== "custom" || customHandler) && (
              <div key={prop.name} className="widget-settings-item">
                {prop.type !== "custom" && (
                  <label
                    htmlFor={`${id}_${prop.name}`}
                    className="widget-settings-name"
                  >
                    {prop.displayName}
                  </label>
                )}
                {(!prop.type || prop.type == "string") && (
                  <input
                    id={`${id}_${prop.name}`}
                    value={prop.value}
                    className="widget-settings-value"
                    onChange={(e) =>
                      updateConfig(id, prop.name, e.target.value)
                    }
                  />
                )}
                {prop.type === "fontselect" && (
                  <FontSelect
                    prop={prop}
                    onChange={(value) => updateConfig(id, prop.name, value)}
                  />
                )}
                {prop.type === "color" && (
                  <div className="color-container">
                    <ColorPicker
                      value={prop.value}
                      onChange={(value) => updateConfig(id, prop.name, value)}
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
                        onChange={(e) =>
                          updateConfig(id, prop.name, e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {prop.type === "boolean" && (
                  <BooleanPropertyInput
                    prop={prop}
                    onChange={() => updateConfig(id, prop.name, !prop.value)}
                  />
                )}
                {prop.type === "custom" && customHandler ? (
                  customHandler(prop)
                ) : (
                  <></>
                )}
                {prop.type === "number" && (
                  <>
                    <input
                      value={prop.value}
                      type="number"
                      className="widget-settings-value"
                      onChange={(e) =>
                        updateConfig(id, prop.name, e.target.value)
                      }
                    />
                  </>
                )}
              </div>
            ),
        )}
    </>
  );
}
