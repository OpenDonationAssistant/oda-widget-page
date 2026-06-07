import { createContext } from "react";
import { AutomationTrigger } from "./AutomationState";
import { FilledDonationGoalTrigger } from "./AutomationTrigger/FilledDonationGoalTrigger";
import { Renderable } from "../../utils";
import { ChannelRaidedTrigger } from "./AutomationTrigger/ChannedRaidedTrigger";
import { StreamStartedTrigger } from "./AutomationTrigger/StreamStartedTrigger";

export class AutomationTriggerController {
  public get triggers(): (AutomationTrigger & Renderable)[] {
    return [
      new FilledDonationGoalTrigger(),
      new ChannelRaidedTrigger(),
      new StreamStartedTrigger(),
    ];
  }

  public get(id: string) {
    return this.triggers.filter((trigger) => trigger.id === id).at(0);
  }
}

export const AutomationTriggerControllerContext = createContext(
  new AutomationTriggerController(),
);
