import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { Flex, Segmented, Select } from "antd";
import { AutomationTrigger } from "../AutomationState";
import { ReactNode, useContext } from "react";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";
import { WidgetStoreContext } from "../../../stores/WidgetStore";
import { DonationGoalWidgetSettings } from "../../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { useTranslation } from "react-i18next";

interface FilledDonationGoalTriggerValue {
  unit: "amount" | "percent";
  value: number;
  goalId: string | null;
  widgetId: string | null;
}

const FilledDonationGoalTriggerComponent = observer(
  ({ trigger }: { trigger: FilledDonationGoalTrigger }) => {
    const { t } = useTranslation();
    const widgets = useContext(WidgetStoreContext);

    return (
      <Flex vertical gap={9}>
        <Select
          className="full-width"
          value={trigger.value.goalId}
          options={widgets
            ?.search({ type: "donationgoal" })
            .map((widget) => widget.config as DonationGoalWidgetSettings)
            .flatMap((config) =>
              config.goalProperty.value.map((goal) => {
                return {
                  label: goal.briefDescription,
                  value: goal.id,
                };
              }),
            )}
          onChange={(value) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.goalId = value;
              draft.widgetId =
                widgets
                  ?.search({ type: "donationgoal" })
                  .filter(
                    (it) =>
                      (
                        it.config as DonationGoalWidgetSettings
                      ).goalProperty.value.findIndex(
                        (goal) => goal.id === value,
                      ) > -1,
                  )
                  .map((widget) => widget.id)
                  .at(0) ?? "";
            });
          }}
        />
        <InputNumber
          value={trigger.value.value}
          onChange={(value) => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.value = value;
            });
          }}
        />
        <Segmented
          value={trigger.value.unit}
          options={[
            { label: t("automation-goal-unit-percent"), value: "percent" },
            { label: t("automation-goal-unit-amount"), value: "amount" },
          ]}
          onChange={(value: "percent" | "amount") => {
            trigger.value = produce(trigger.value, (draft) => {
              draft.unit = value;
            });
          }}
        />
      </Flex>
    );
  },
);

export class FilledDonationGoalTrigger
  implements AutomationTrigger, Renderable
{
  private _value: FilledDonationGoalTriggerValue = {
    unit: "percent",
    value: 100,
    goalId: null,
    widgetId: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public get name() {
    return "automation-trigger-donation-goal-filled";
  }

  public get id() {
    return "donationgoal-filled";
  }

  public set value(value: FilledDonationGoalTriggerValue) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get markup(): ReactNode {
    return <FilledDonationGoalTriggerComponent trigger={this} />;
  }
}
