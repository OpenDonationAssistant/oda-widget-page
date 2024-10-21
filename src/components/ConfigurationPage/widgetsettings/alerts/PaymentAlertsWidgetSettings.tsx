import { toJS } from "mobx";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { PaymentAlertsProperty } from "./PaymentAlertsProperty";
import { Alert } from "./Alert";
import { log } from "../../../../logging";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  private _alerts: PaymentAlertsProperty;

  constructor() {
    const defaultAlert = new PaymentAlertsProperty();
    super({
      sections: [
        {
          key: "alerts",
          title: "tab-alerts",
          properties: [defaultAlert],
        },
      ],
    });
    this._alerts = defaultAlert;
  }

  public prepareConfig(): { name: string; value: any }[] {
    if (this._alerts === undefined) {
      log.debug({ settings: this._alerts }, "nullable alerts ");
      return [];
    }
    return [
      {
        name: this._alerts.name,
        value: this._alerts.config(),
      },
    ];
  }

  public set(key: string, value: any, asInitialValue = false): void {
    log.debug({ value: value }, "calling payment alerts widget settings");
    this.sections = this.sections.map((section) => {
      if (section.key === "alerts") {
        section.properties = section.properties.map((prop) => {
          if (prop.name === key) {
            const updated = PaymentAlertsProperty.fromConfig(value);
            this._alerts = updated;
            log.debug({ updated: toJS(updated) }, "updated payment alerts");
            if (asInitialValue){
              updated.markSaved();
            }
            return updated;
          }
          return prop;
        });
      }
      this.makeIndex();
      return section;
    });
    log.debug({ sections: this.sections }, "updated settings");
  }
}
