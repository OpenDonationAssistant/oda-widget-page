import { NumberProperty } from "../widgetproperties/NumberProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const  tabs = new Map();
    tabs.set("general", "Общие");
    super(
      widgetId,
      properties,
      [
        new NumberProperty(
          widgetId,
          "nicknameFontSize",
          "number",
          "28",
          "widget-payments-customer-font-size",
          "general"
        ),
        new NumberProperty(
          widgetId,
          "messageFontSize",
          "number",
          "19",
          "widget-payments-message-font-size",
          "general"
        ),
      ],
      tabs
    );
  }

  copy(){
    return new PaymentsWidgetSettings(this.widgetId, this.properties);
  }
}
