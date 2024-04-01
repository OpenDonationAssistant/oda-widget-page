import { WidgetProperty } from "./widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";

interface WidgetSettings {
  get(key: string): WidgetProperty | undefined;
}

class EmptyWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    super(widgetId, properties, [], new Map());
  }
}

export { WidgetSettings, EmptyWidgetSettings };
