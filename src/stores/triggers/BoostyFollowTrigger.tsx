import { makeAutoObservable } from "mobx";
import { Trigger, TriggerCause } from "./AlertTriggerInterface";
import { ReactNode } from "react";

export const BOOSTY_FOLLOW_TRIGGER = {
  description: "Отслеживание на Boosty",
  type: "boosty_follow",
};

export class BoostyFollowTrigger implements Trigger {
  type = BOOSTY_FOLLOW_TRIGGER.type;
  description = BOOSTY_FOLLOW_TRIGGER.description;
  category = "boosty";

  constructor() {
    makeAutoObservable(this);
  }

  priorityFor(event: TriggerCause): number {
    return event.type === this.type ? 0 : -1;
  }

  markup(): ReactNode {
    return <></>;
  }
}
