import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { observer } from "mobx-react-lite";
import { AbstractDonationGoalState } from "./DonationGoalState";
import { uuidv7 } from "uuidv7";
import { VariableScope } from "../../components/ConfigurationPage/widgetsettings/VariableScope";
import { Variable } from "../Automation/AutomationState";
import { ElementRenderer } from "../../components/Element/ElementRenderer";

export const DonationGoal = observer(
  ({
    // state,
    settings,
  }: {
    // state: AbstractDonationGoalState;
    settings: DonationGoalWidgetSettings;
  }) => {
    const goals = settings.goalProperty.value.map((goal) => {
      return [
        {
          type: "string",
          name: "name",
          value: goal.briefDescription,
          id: uuidv7(),
        },
        {
          type: "string",
          name: "description",
          value: goal.fullDescription,
          id: uuidv7(),
        },
        {
          type: "number",
          name: "collected",
          value: goal.accumulatedAmount.major,
          id: uuidv7(),
        },
        {
          type: "number",
          name: "required",
          value: goal.requiredAmount.major,
          id: uuidv7(),
        },
        {
          type: "string",
          name: "proportion",
          value: `${Math.trunc(
            ((goal.accumulatedAmount?.major ?? 0) / goal.requiredAmount.major) *
              100,
          )}`,
          id: uuidv7(),
        },
        {
          type: "string",
          name: "currency",
          value: "RUB",
          id: uuidv7(),
        },
      ] as Variable[];
    });

    return (
      <VariableScope
        variables={[
          {
            id: uuidv7(),
            value: goals,
            name: "items",
            type: "matrix",
            tags: [],
          },
        ]}
      >
        {settings.elements
          .filter((element) => element.data.containerId === null)
          .map((element) => (
            <ElementRenderer element={element} key={element.data.id} />
          ))}
      </VariableScope>
    );
  },
);
