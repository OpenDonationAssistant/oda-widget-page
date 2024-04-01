import { log } from "../../../logging";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  public alerts: any[];

  constructor(widgetId: string, properties: WidgetProperty[], alerts: any[]) {
    log.debug({ alerts: alerts }, `creating payment-alerts settings`);
    super(
      widgetId,
      properties,
      [
        new BooleanProperty(
          widgetId,
          "useGreenscreen",
          "boolean",
          false,
          "Использовать greenscreen",
        ),
      ],
      new Map(),
    );
    this.alerts = alerts;
  }

  public copy() {
    return new PaymentAlertsWidgetSettings(
      this.widgetId,
      this.properties,
      this.alerts,
    );
  }
}
