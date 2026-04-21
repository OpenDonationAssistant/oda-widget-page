import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import { ReactNode } from "react";

export const BOOSTY_FOLLOW_TRIGGER = {
  description: "Отслеживание на Boosty",
  type: "boosty_follow",
};

export class BoostyFollowTrigger implements Trigger {
  type = BOOSTY_FOLLOW_TRIGGER.type;
  description = BOOSTY_FOLLOW_TRIGGER.description;

  constructor() {
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return event.system === "Boosty" && event.event === "follow";
  }

  public compare(other: Trigger): number {
    return 0;
  }

  markup(): ReactNode {
    return <></>;
  }
}
