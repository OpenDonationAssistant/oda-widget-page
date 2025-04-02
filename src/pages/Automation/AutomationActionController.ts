import { createContext } from "react";
import { AutomationAction } from "./AutomationState";
import { RunAlertAction } from "./AutomationAction/RunAlertAction";
import { Renderable } from "../../utils";
import { IncreaseVariableAction } from "./AutomationAction/IncreaseVariableAction";
import { IncreaseDonationGoalAction } from "./AutomationAction/IncreaseDonationGoalAction";
import { RefreshDonationGoalAction } from "./AutomationAction/RefreshDonationGoalAction";

export class AutomationActionController {
  public get actions(): (AutomationAction & Renderable)[] {
    return [
      new RunAlertAction(),
      new IncreaseVariableAction(),
      new IncreaseDonationGoalAction(),
      new RefreshDonationGoalAction(),
    ];
  }

  public get(id: string) {
    return this.actions.filter((action) => action.id === id).at(0);
  }
}

export const AutomationActionControllerContext = createContext(
  new AutomationActionController(),
);
