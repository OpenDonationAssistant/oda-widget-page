import { createContext } from "react";
import { AutomationTrigger } from "./AutomationState";
import { FilledDonationGoalTrigger } from "./AutomationTrigger/FilledDonationGoalTrigger";
import { Renderable } from "../../utils";
import { ChannelRaidedTrigger } from "./AutomationTrigger/ChannedRaidedTrigger";
import { StreamStartedTrigger } from "./AutomationTrigger/StreamStartedTrigger";
import { ChatCommandTrigger } from "./AutomationTrigger/ChatCommandTrigger";
import { RewardTrigger } from "./AutomationTrigger/RewardTrigger";
import { DonationTrigger } from "./AutomationTrigger/DonationTrigger";
import { VariableEqualsValueTrigger } from "./AutomationTrigger/VariableEqualsValueTrigger";
import { VariableValueChangedTrigger } from "./AutomationTrigger/VariableValueChangedTrigger";

export class AutomationTriggerController {
  public get triggers(): (AutomationTrigger & Renderable)[] {
    return [
      new FilledDonationGoalTrigger(),
      new ChannelRaidedTrigger(),
      new StreamStartedTrigger(),
      new DonationTrigger(),
      new VariableEqualsValueTrigger(),
      new VariableValueChangedTrigger(),
      // new ChatCommandTrigger(),
      // new RewardTrigger(),
    ];
  }

  public get(id: string) {
    return this.triggers.filter((trigger) => trigger.id === id).at(0);
  }
}

export const AutomationTriggerControllerContext = createContext(
  new AutomationTriggerController(),
);
