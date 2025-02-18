import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { DonationGoalWidgetSettings } from "../ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { AbstractDonationGoalState } from "./DonationGoalState";

export class DemoDonationGoalState implements AbstractDonationGoalState {
  private _config: DonationGoalWidgetSettings;

  constructor(config: DonationGoalWidgetSettings) {
    this._config = config;
  }

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

  public get goals(): Goal[] {
    return this._config.goalProperty.value ?? [];
  }
}
