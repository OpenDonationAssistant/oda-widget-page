import { NumberProperty } from "../widgetproperties/NumberProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
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
        ),
        new NumberProperty(
          widgetId,
          "messageFontSize",
          "number",
          "19",
          "widget-payments-message-font-size",
        ),
      ],
      new Map(),
    );
  }

  copy(){
    return new PaymentsWidgetSettings(this.widgetId, this.properties);
  }
}
