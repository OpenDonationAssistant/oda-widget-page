import React, { useContext, useEffect, useState } from "react";
import { WidgetsContext } from "../ConfigurationPage/WidgetsContext";
import classes from "./Tabs.module.css";
import { log } from "../../logging";

export default function Tabs({
  widgetId,
  onChange,
}: {
  widgetId: string;
  onChange: (tab: string) => void;
}) {
  const { config } = useContext(WidgetsContext);
  const [tab, setTab] = useState<string>("");

  useEffect(() => {
    if (tab){
      return;
    }
    const settings = config.get(widgetId);
    log.debug({ settings: settings }, "trying to find first tab");
    if (!settings) {
      return;
    }
    const firstTab = settings.tabDescriptions.keys().next();
    if (firstTab) {
      log.debug({ tab: firstTab.value }, "settings first tab");
      onChange(firstTab.value);
      setTab(firstTab.value);
    }
  }, [config]);

  const tabs = () => {
    const settings = config.get(widgetId);
    if (!settings) {
      return <></>;
    }
    return [...settings.tabDescriptions.keys()].map((key) => (
      <div
        key={key}
        className={`settings-tab-item ${tab === key ? "active" : ""}`}
        onClick={() => {
          setTab(key);
          onChange(key);
        }}
      >
        {settings.tabDescriptions.get(key)}
      </div>
    ));
  };

  return <div className={`${classes.settingstabs}`}>{tabs()}</div>;
}
