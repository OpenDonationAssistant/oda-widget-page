import React, { useContext, useEffect, useState } from "react";
import classes from "./Tabs.module.css";
import { log } from "../../logging";
import { WidgetProperty } from "../ConfigurationPage/widgetproperties/WidgetProperty";
import { WidgetsContext } from "../ConfigurationPage/WidgetsContext";

export default function Tabs({
  tabs,
  properties,
}: {
  tabs: Map<string, string>;
  properties: WidgetProperty[];
}) {
  const { updateConfig } = useContext(WidgetsContext);
  const [tab, setTab] = useState<string>("");

  useEffect(() => {
    if (tab) {
      return;
    }
    const firstTab = tabs.keys().next();
    if (firstTab) {
      log.debug({ tab: firstTab.value }, "settings first tab");
      setTab(firstTab.value);
    }
    return () => setTab("");
  }, [tabs]);

  const tabsMarkup = () => {
    return [...tabs.keys()].map((key) => (
      <div
        key={key}
        className={`settings-tab-item ${tab === key ? "active" : ""}`}
        onClick={() => {
          setTab(key);
        }}
      >
        {tabs.get(key)}
      </div>
    ));
  };

  return (
    <>
      <div className={`${classes.settingstabs}`}>{tabsMarkup()}</div>
      {properties
        ?.filter((prop) => prop.type !== "custom")
        ?.filter((prop) => prop.tab === tab)
        .map((prop) => prop.markup(updateConfig))}
    </>
  );
}
