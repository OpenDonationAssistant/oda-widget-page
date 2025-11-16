import { Select } from "antd";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { WidgetStoreContext } from "../../../stores/WidgetStore";
import { PaymentAlertsWidgetSettings } from "../../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";

export interface RunAlertActionValue {}

const RunAlertActionComponent = observer(() => {
  const widgets = useContext(WidgetStoreContext);

  return (
    <LabeledContainer displayName="">
      <Select
        className="full-width"
        options={widgets?.list
          .filter((widgets) => widgets.type === "payment-alerts")
          .map((widget) => widget.config as PaymentAlertsWidgetSettings)
          .flatMap((config) =>
            config.alerts.value.map((alert) => {
              return { label: alert.property("name"), value: alert.id };
            }),
          )}
      />
    </LabeledContainer>
  );
});

export class RunAlertAction implements AutomationAction, Renderable {
  private _value: RunAlertActionValue = {};

  public set value(value: RunAlertActionValue){
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get id() {
    return "run-alert";
  }

  public get name() {
    return "Запустить алерт";
  }

  public get markup() {
    return <RunAlertActionComponent />;
  }
}
