import { ReactNode } from "react";
import { log } from "../../../../logging";
import { WidgetProperty } from "../../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { Alert } from "./Alert";
import PaymentAlertsWidgetSettingsComponent from "./PaymentAlertsWidgetSettingsComponent";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  public alerts: Alert[];

  constructor(widgetId: string, properties: WidgetProperty[], alerts: Alert[]) {
    log.debug({ alerts: alerts }, `creating payment-alerts settings`);
    super(widgetId, properties, [], new Map());
    this.alerts = alerts;
  }

  public copy() {
    return new PaymentAlertsWidgetSettings(
      this.widgetId,
      this.properties,
      this.alerts,
    );
  }

  public markup(): ReactNode {
    return <PaymentAlertsWidgetSettingsComponent id={this.widgetId} />;
  }
}
