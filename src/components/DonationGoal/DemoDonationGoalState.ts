import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { AbstractDonationGoalState } from "./DonationGoalState";

export class DemoDonationGoalState implements AbstractDonationGoalState {
  private _goals: Goal[] = [
    {
      id: "goal-1",
      default: true,
      briefDescription: "Тестовая цель",
      fullDescription: "Длинное описание красивой цели",
      accumulatedAmount: {
        major: 40,
        currency: "RUB",
      },
      requiredAmount: {
        major: 100,
        currency: "RUB",
      },
    },
  ];

  public get goals() {
    return this._goals;
  }
}
