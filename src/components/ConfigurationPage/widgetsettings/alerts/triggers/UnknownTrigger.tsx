import { ReactNode } from "react";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";

export const UNKNOWN_TRIGGER = {
  description: "никогда",
  type: "never",
};

export class UnknownTrigger implements Trigger {
  type = UNKNOWN_TRIGGER;

  isTriggered(event: DonationEvent): boolean {
    return true;
  }

  compare(other: Trigger): number {
    return 0;
  }

  public markup(): ReactNode {
    return <></>;
  }
}
