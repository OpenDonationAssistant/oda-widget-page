import { makeAutoObservable } from "mobx";
import { Trigger, TriggerCause } from "./AlertTriggerInterface";
import { ReactNode } from "react";

export const BOOSTY_SUBSCRIPTION_TRIGGER = {
  description: "Подписка Boosty",
  type: "boosty_subscription",
};

export class BoostySubscriptionTrigger implements Trigger {
  type = BOOSTY_SUBSCRIPTION_TRIGGER.type;
  description = BOOSTY_SUBSCRIPTION_TRIGGER.description;
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
