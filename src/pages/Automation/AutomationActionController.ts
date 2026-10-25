import { createContext } from "react";
import { AutomationAction } from "./AutomationState";
import { RunAlertAction } from "./AutomationAction/RunAlertAction";
import { Renderable } from "../../utils";
import { IncreaseVariableAction } from "./AutomationAction/IncreaseVariableAction";
import { IncreaseDonationGoalAction } from "./AutomationAction/IncreaseDonationGoalAction";
import { RefreshDonationGoalAction } from "./AutomationAction/RefreshDonationGoalAction";
import { RunReelAction } from "./AutomationAction/RunReelAction";
import { MakePinnedMessageAction } from "./AutomationAction/MakePinnedMessageAction";
import { ShoutoutAction } from "./AutomationAction/ShoutoutAction";
import { RestCallAction } from "./AutomationAction/RestCallAction";
import { SetVariableValueAction } from "./AutomationAction/SetVariableValueAction";

export class AutomationActionController {
  public get actions(): (AutomationAction & Renderable)[] {
    return [
      new RunAlertAction(),
      new IncreaseVariableAction(),
      new SetVariableValueAction(),
      new IncreaseDonationGoalAction(),
      new RefreshDonationGoalAction(),
      new RunReelAction(),
      new MakePinnedMessageAction(),
      new ShoutoutAction(),
      new RestCallAction(),
    ];
  }

  public get(id: string) {
    return this.actions.filter((action) => action.id === id).at(0);
  }
}

export const AutomationActionControllerContext = createContext(
  new AutomationActionController(),
);
