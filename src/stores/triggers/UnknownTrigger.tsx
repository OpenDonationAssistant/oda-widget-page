import { ReactNode } from "react";
import { TriggerCause, Trigger } from "./AlertTriggerInterface";

export const UNKNOWN_TRIGGER = {
  description: "никогда",
  type: "never",
  category: "unknown",
};

export class UnknownTrigger implements Trigger {
  type = UNKNOWN_TRIGGER.type;
  category = "unknown";
  description = UNKNOWN_TRIGGER.description;

  priorityFor(event: TriggerCause): number {
    return -1;
  }

  public markup(): ReactNode {
    return <></>;
  }
}
