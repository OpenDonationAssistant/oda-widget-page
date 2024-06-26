import { WidgetProperty } from "../components/ConfigurationPage/widgetproperties/WidgetProperty";

interface WidgetConfigData {
  properties: WidgetProperty[];
}

interface WidgetSettings {
  id: string;
  type: string;
  sortOrder: number;
  name: string;
  ownerId: string;
  config: WidgetConfigData;
}

export { WidgetConfigData, WidgetSettings };
