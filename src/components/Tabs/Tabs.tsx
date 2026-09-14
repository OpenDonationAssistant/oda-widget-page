import { Tabs as AntTabs } from "antd";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "../ConfigurationPage/widgetsettings/AbstractWidgetSettings";

export default function Tabs({ sections }: { sections: SettingsSection[] }) {
  const { t } = useTranslation();

  const tabPaneGenerator = (section: SettingsSection) => {
    return {
      label: t(section.title),
      key: section.key,
      children: section.properties.map((prop) => prop.markup()),
    };
  };

  return <AntTabs type="card" items={sections.map(tabPaneGenerator)} />;
}
