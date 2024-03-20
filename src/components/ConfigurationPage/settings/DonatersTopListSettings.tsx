import React, { useContext, useState } from "react";
import { WidgetsContext } from "../WidgetsContext";
import BaseSettings from "./BaseSettings";
import Tabs from "../../Tabs/Tabs";

export default function DonatersTopListSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);
  const [tab, setTab] = useState<string>("");

  return (
    <>
      <Tabs widgetId={id} onChange={(tab: string) => setTab(tab)} />
      <BaseSettings
        id={id}
        onChange={onChange}
        propertyFilter={(prop) => prop.tab === tab}
      />
      {config
        .get(id)
        ?.properties?.filter((prop) => prop.tab === tab)
        .map(
          (prop) =>
            prop.type === "custom" && (
              <div key={prop.name} className="widget-settings-item">
                <label className="widget-settings-name">
                  {prop.displayName}
                </label>
                {prop.name === "type" && (
                  <select
                    value={prop.value}
                    className="widget-settings-value select"
                    onChange={(e) => updateConfig(id, prop.name, e.target.value)}
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
                    onChange={(e) => updateConfig(id, prop.name, e.target.value)}
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
                          onChange={(e) => updateConfig(id, prop.name, e.target.value)}
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
                          onChange={(e) => updateConfig(id, prop.name, e.target.value)}
                        />
                        <img
                          title="horizontal"
                          src={`/icons/horizontal.jpg`}
                          onClick={() => updateConfig(id, prop.name, "horizontal")}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            ),
        )}
    </>
  );
}
