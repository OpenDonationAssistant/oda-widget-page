import { Flex, Select } from "antd";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import { observer } from "mobx-react-lite";
import { WidgetStoreContext } from "../../../stores/WidgetStore";
import { useContext } from "react";
import { DonationGoalWidgetSettings } from "../../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { makeAutoObservable } from "mobx";

export interface RefreshDonationGoalActionValue {
  goalId: string;
  widgetId: string;
}

const RefreshDonationGoalActionComponent = observer(
  ({ action }: { action: RefreshDonationGoalAction }) => {
    const widgets = useContext(WidgetStoreContext);

    return (
      <Flex vertical>
        <Select
          className="full-width"
          value={action.value.goalId}
          options={widgets
            ?.search({ type: "donationgoal" })
            .map((widget) => {
              return {
                widgetId: widget.id,
                config: widget.config as DonationGoalWidgetSettings,
              };
            })
            .flatMap((it) =>
              it.config.goalProperty.value.map((goal) => {
                return { label: goal.briefDescription, value: goal.id };
              }),
            )}
          onChange={(id) => {
            const widgetId = widgets
              ?.search({ type: "donationgoal" })
              .filter(
                (widget) =>
                  (
                    widget.config as DonationGoalWidgetSettings
                  ).goalProperty.value.filter((goal) => goal.id === id).length >
                  0,
              )
              .map((widget) => widget.id)
              .at(0);
            if (widgetId) {
              action.setWidgetId(widgetId);
              action.setGoalId(id);
            }
          }}
        />
      </Flex>
    );
  },
);

export class RefreshDonationGoalAction implements AutomationAction, Renderable {
  private _value: RefreshDonationGoalActionValue = {
    goalId: "",
    widgetId: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  public setGoalId(id: string) {
    this._value.goalId = id;
  }

  public setWidgetId(id: string) {
    this._value.widgetId = id;
  }

  public get value() {
    return this._value;
  }

  public set value(value: RefreshDonationGoalActionValue){
    this._value = value;
  }

  public get id() {
    return "refresh-donation-goal";
  }

  public get name() {
    return "Обнулить сумму сбора средств";
  }

  public get markup() {
    return <RefreshDonationGoalActionComponent action={this} />;
  }
}
