import { Flex, Select } from "antd";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { WidgetStoreContext } from "../../../stores/WidgetStore";
import { DonationGoalWidgetSettings } from "../../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { makeAutoObservable } from "mobx";

export interface IncreaseDonationGoalActionValue {
  goalId: string;
  widgetId: string;
  amount: number;
}

const IncreaseDonationGoalActionComponent = observer(
  ({ action }: { action: IncreaseDonationGoalAction }) => {
    const widgets = useContext(WidgetStoreContext);

    return (
      <Flex vertical gap={9}>
        <Select
          className="full-width"
          value={action.value.goalId}
          options={widgets?.list
            .filter((widget) => widget.type === "donationgoal")
            .map((widget) => widget.config as DonationGoalWidgetSettings)
            .flatMap((config) =>
              config.goalProperty.value.map((goal) => {
                return { label: goal.briefDescription, value: goal.id };
              }),
            )}
          onChange={(id) => {
            action.setGoalId(id);
            action.setWidgetId(
              widgets
                ?.search({ type: "donationgoal" })
                .filter((widget) => {
                  return (
                    widget.config as DonationGoalWidgetSettings
                  ).goalProperty.value.filter((goal) => goal.id === id);
                })
                .at(0)?.id ?? "",
            );
          }}
        />
        <InputNumber
          value={action.value.amount}
          onChange={(amount) => action.setAmount(amount)}
        />
      </Flex>
    );
  },
);

export class IncreaseDonationGoalAction
  implements AutomationAction, Renderable
{
  private _value: IncreaseDonationGoalActionValue = {
    goalId: "",
    widgetId: "",
    amount: 1000,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public setAmount(amount: number) {
    this._value.amount = amount;
  }

  public setGoalId(id: string) {
    this._value.goalId = id;
  }

  public setWidgetId(id: string) {
    this._value.widgetId = id;
  }

  public set value(value: IncreaseDonationGoalActionValue) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get id() {
    return "increase-donation-goal";
  }

  public get name() {
    return "Увеличить сумму цели сбора средств";
  }

  public get markup() {
    return <IncreaseDonationGoalActionComponent action={this} />;
  }
}
