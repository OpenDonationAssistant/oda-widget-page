import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import classes from "./PaymentAlertsProperty.module.css";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { reaction } from "mobx";
import { log } from "../../../../logging";
import { AlertComponent } from "./AlertComponent";

const PaymentAlertsPropertyComponent = observer(
  ({ property }: { property: PaymentAlertsProperty }) => {
    const { t } = useTranslation();

    return (
      <>
        <div className={`${classes.adddalertbutton}`}>
          <button
            className="oda-btn-default"
            onClick={() => property.addAlert()}
          >
            {t("button-add-alert")}
          </button>
        </div>
        <div className={`${classes.preview}`}>
          {property.value.map((it) => (
            <AlertComponent alert={it} />
          ))}
        </div>
      </>
    );
  },
);

export class PaymentAlertsProperty extends DefaultWidgetProperty<Alert[]> {
  constructor() {
    super({
      name: "alerts",
      value: [],
      displayName: "",
    });
  }

  public static fromConfig(config: any): PaymentAlertsProperty {
    const property = new PaymentAlertsProperty();
    property.value = config.map(
      (it: any) =>
        new Alert({
          ...it,
          ...{ removeFn: (id: string) => property.removeAlert(id) },
        }),
    );
    return property;
  }

  public config() {
    return this.value.map((it) => it.config());
  }

  addAlert(): void {
    this._value = [
      ...this._value,
      new Alert({ removeFn: (id: string) => this.removeAlert(id) }),
    ];
  }

  removeAlert(id: string) {
    this.value = this.value.filter((alert) => alert.id !== id);
  }

  markup(): ReactNode {
    return <PaymentAlertsPropertyComponent property={this} />;
  }
}
