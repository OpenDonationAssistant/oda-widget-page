import React, { useContext } from "react";
import { WidgetProperty } from "../ConfigurationPage/widgetproperties/WidgetProperty";
import { WidgetsContext } from "../ConfigurationPage/WidgetsContext";
import { Tabs as AntTabs } from "antd";
import { useTranslation } from "react-i18next";

export default function Tabs({
  tabs,
  properties,
}: {
  tabs: Map<string, string>;
  properties: WidgetProperty[];
}) {
  const { updateConfig } = useContext(WidgetsContext);
  const { t } = useTranslation();

  const tabPaneGenerator = (key: string) => {
    return {
      label: t(tabs.get(key) ?? ""),
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
