import { ReactNode, createContext, useContext } from "react";
import { log } from "../../../../logging";
import { WidgetProperty } from "../../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { Alert } from "./Alert";
import { PaymentAlertsWidgetSettingsComponent } from "./PaymentAlertsWidgetSettingsComponent";
import { makeObservable, observable } from "mobx";
import { Notifier } from "../../Notifier";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  private _alerts: Alert[];

  constructor({
    properties,
    alerts,
    notifier,
  }: {
    properties: WidgetProperty<any>[];
    alerts: Alert[];
    notifier: Notifier;
  }) {
    log.debug({ alerts: alerts }, `creating payment-alerts settings`);
    super({
      properties: properties,
      sections: [],
      notifier: notifier,
    });
    this._alerts = alerts;
    makeObservable(this, {
      _alerts: observable,
    });
  }

  public get alerts(): Alert[] {
    return this._alerts;
  }

  public addAlert(): void {
    this._alerts.push(new Alert({}));
  }

  public deleteAlert(id: string) {
    this._alerts = this._alerts.filter((alert) => alert.id !== id);
  }

  public markup(): ReactNode {
    return (
      <PaymentAlertsWidgetSettingsContext.Provider value={this}>
        <PaymentAlertsWidgetSettingsComponent />
      </PaymentAlertsWidgetSettingsContext.Provider>
    );
  }
}

export const PaymentAlertsWidgetSettingsContext =
  createContext<PaymentAlertsWidgetSettings>(
    new PaymentAlertsWidgetSettings({
      properties: [],
      alerts: [],
      notifier: { notify: () => {} },
    }),
  );
