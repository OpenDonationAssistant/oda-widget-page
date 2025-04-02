import { createContext } from "react";
import { AutomationTrigger } from "./AutomationState";
import { FilledDonationGoalTrigger } from "./AutomationTrigger/FilledDonationGoalTrigger";
import { Renderable } from "../../utils";

export class AutomationTriggerController {
  public get triggers(): (AutomationTrigger & Renderable)[] {
    return [new FilledDonationGoalTrigger()];
  }

  public get(id: string) {
    return this.triggers.filter((trigger) => trigger.id === id).at(0);
  }
}

export const AutomationTriggerControllerContext = createContext(
  new AutomationTriggerController(),
);
