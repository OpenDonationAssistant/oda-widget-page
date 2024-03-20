import React, { useContext, useState } from "react";
import { WidgetsContext } from "../ConfigurationPage/WidgetsContext";
import classes from "./Tabs.module.css";

export default function Tabs({
  widgetId,
  onChange,
}: {
  widgetId: string;
  onChange: (tab: string) => void;
}) {
  const [tab, setTab] = useState<string>("");
  const { config } = useContext(WidgetsContext);

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
