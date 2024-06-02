import React, { useContext } from "react";
import { WidgetProperty } from "../ConfigurationPage/widgetproperties/WidgetProperty";
import { WidgetsContext } from "../ConfigurationPage/WidgetsContext";
import { Tabs as AntTabs } from "antd";

export default function Tabs({
  tabs,
  properties,
}: {
  tabs: Map<string, string>;
  properties: WidgetProperty[];
}) {
  const { updateConfig } = useContext(WidgetsContext);

  const tabPaneGenerator = (key: string) => {
    return {
      label: tabs.get(key)?.toLowerCase(),
      key: key,
      children: properties
        ?.filter((prop) => prop.type !== "custom")
        ?.filter((prop) => prop.tab === key)
        .map((prop) => prop.markup(updateConfig)),
    };
  };

  return (
    <>
      {(!tabs || tabs.size === 0) &&
        properties.map((prop) => prop.markup(updateConfig))}
      {tabs && tabs.size > 0 && (
        <AntTabs type="card" items={[...tabs.keys()].map(tabPaneGenerator)} />
      )}
    </>
  );
}
