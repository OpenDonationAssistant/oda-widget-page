import React, { useContext, useState } from "react";
import { WidgetsContext } from "../WidgetsContext";
import BaseSettings from "./BaseSettings";
import Tabs from "../../Tabs/Tabs";

export default function DonatersTopListSettings({ id }: { id: string }) {
  const { config, updateConfig } = useContext(WidgetsContext);
  const [tab, setTab] = useState<string>("");

  return (
    <>
      <Tabs widgetId={id} onChange={(tab: string) => setTab(tab)} />
      <BaseSettings id={id} propertyFilter={(prop) => prop.tab === tab} />
      {config
        .get(id)
        ?.properties?.filter((prop) => prop.tab === tab)
        .map((prop) => {
          if (prop.name === "type" || prop.name === "period") {
            return prop.markup();
          }
          if (prop.name === "layout") {
            return (
              <div key={prop.name} className="widget-settings-item">
                <label className="widget-settings-name">
                  {prop.displayName}
                </label>
                <div className="widget-settings-radiocontainer">
                  <label className="widget-settings-radiobutton">
                    <input
                      title="vertical"
                      type="radio"
                      value="vertical"
                      checked={prop.value === "vertical"}
                      onChange={(e) =>
                        updateConfig(id, prop.name, e.target.value)
                      }
                    />
                    <img
                      title="vertical"
                      src={`/icons/vertical.jpg`}
                      onClick={() => updateConfig(id, prop.name, "vertical")}
                    />
                  </label>
                  <label className="widget-settings-radiobutton">
                    <input
                      title="horizontal"
                      type="radio"
                      value="horizontal"
                      checked={prop.value === "horizontal"}
                      onChange={(e) =>
                        updateConfig(id, prop.name, e.target.value)
                      }
                    />
                    <img
                      title="horizontal"
                      src={`/icons/horizontal.jpg`}
                      onClick={() => updateConfig(id, prop.name, "horizontal")}
                    />
                  </label>
                </div>
              </div>
            );
          }
        })}
    </>
  );
}
