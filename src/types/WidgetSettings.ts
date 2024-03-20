import { WidgetProperty } from "../components/ConfigurationPage/WidgetSettings";

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
