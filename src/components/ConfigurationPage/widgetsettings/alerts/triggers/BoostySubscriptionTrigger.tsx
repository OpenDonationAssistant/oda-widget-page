import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import { ReactNode } from "react";

export const BOOSTY_SUBSCRIPTION_TRIGGER = {
  description: "Подписка Boosty",
  type: "boosty_subscription",
};

export class BoostySubscriptionTrigger implements Trigger {
  type = BOOSTY_SUBSCRIPTION_TRIGGER.type;
  description = BOOSTY_SUBSCRIPTION_TRIGGER.description;

  constructor() {
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return event.system === "Boosty" && event.event === "subscription";
  }

  public compare(other: Trigger): number {
    return 0;
  }

  markup(): ReactNode {
    return <></>;
  }
}
