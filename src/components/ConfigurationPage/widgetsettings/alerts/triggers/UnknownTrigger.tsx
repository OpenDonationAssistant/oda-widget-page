import { ReactNode } from "react";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";

export const UNKNOWN_TRIGGER = {
  description: "никогда",
  type: "never",
};

export class UnknownTrigger implements Trigger {
  type = UNKNOWN_TRIGGER.type;
  description = UNKNOWN_TRIGGER.description;

  isTriggered(event: DonationEvent): boolean {
    return false;
  }

  compare(other: Trigger): number {
    return 0;
  }

  public markup(): ReactNode {
    return <></>;
  }
}
