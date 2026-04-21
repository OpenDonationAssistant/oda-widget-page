import { createContext } from "react";
import {
  FIXED_DONATION_AMOUNT_TRIGGER,
  FixedDonationAmountTrigger,
} from "./FixedDonationAmountTrigger";
import {
  LESS_THAN_DONATION_AMOUNT_TRIGGER,
  LessThanDonationAmountTrigger,
} from "./LessThanDonationAmountTrigger";
import {
  RANDE_DONATION_AMOUNT_TRIGGER,
  RangeDonationAmountTrigger,
} from "./RangeDonationAmountTrigger";
import { SYSTEM_TRIGGER, SystemTrigger } from "./SystemTrigger";
import { UNKNOWN_TRIGGER, UnknownTrigger } from "./UnknownTrigger";
import { Trigger, TriggerType } from "./AlertTriggerInterface";
import { makeAutoObservable } from "mobx";
import {
  BOOSTY_SUBSCRIPTION_TRIGGER,
  BoostySubscriptionTrigger,
} from "./BoostySubscriptionTrigger";
import {
  BOOSTY_FOLLOW_TRIGGER,
  BoostyFollowTrigger,
} from "./BoostyFollowTrigger";

export class TriggersStore {
  private _types: TriggerType[] = [
    FIXED_DONATION_AMOUNT_TRIGGER,
    RANDE_DONATION_AMOUNT_TRIGGER,
    LESS_THAN_DONATION_AMOUNT_TRIGGER,
    SYSTEM_TRIGGER,
    BOOSTY_SUBSCRIPTION_TRIGGER,
    BOOSTY_FOLLOW_TRIGGER,
    UNKNOWN_TRIGGER,
  ];
  private _added: Trigger[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public getType(type: string): TriggerType | undefined {
    return this._types.find((t) => t.type === type);
  }

  public get available(): TriggerType[] {
    const additionalFilters: ((t: TriggerType) => boolean)[] = [];
    this._added.forEach((t) => {
      if (t.type === BOOSTY_SUBSCRIPTION_TRIGGER.type) {
        additionalFilters.push((t: TriggerType) => false);
      }
      if (t.type === BOOSTY_FOLLOW_TRIGGER.type) {
        additionalFilters.push((t: TriggerType) => false);
      }
      if (t.type === FIXED_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== RANDE_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== LESS_THAN_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_FOLLOW_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_SUBSCRIPTION_TRIGGER.type,
        );
      }
      if (t.type === RANDE_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== FIXED_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_FOLLOW_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_SUBSCRIPTION_TRIGGER.type,
        );
      }
      if (t.type === LESS_THAN_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== FIXED_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_FOLLOW_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== BOOSTY_SUBSCRIPTION_TRIGGER.type,
        );
      }
    });
    return this._types
      .filter((t) => additionalFilters.every((f) => f(t)))
      .filter((t) => !this._added.find((a) => a.type === t.type));
  }

  public addTrigger(trigger: Trigger) {
    this._added.push(trigger);
  }

  public get added(): Trigger[] {
    return this._added;
  }

  public createTrigger(type: string): Trigger {
    switch (type) {
      case "fixed-donation-amount":
        return new FixedDonationAmountTrigger();
      case "at-least-donation-amount":
        return new RangeDonationAmountTrigger();
      case "less-than-donation-amount":
        return new LessThanDonationAmountTrigger();
      case "system":
        return new SystemTrigger();
      case BOOSTY_SUBSCRIPTION_TRIGGER.type:
        return new BoostySubscriptionTrigger();
      case BOOSTY_FOLLOW_TRIGGER.type:
        return new BoostyFollowTrigger();
      default:
        return new UnknownTrigger();
    }
  }

  public loadTrigger(trigger: Trigger): Trigger {
    switch (trigger.type) {
      case "fixed-donation-amount":
        return new FixedDonationAmountTrigger(
          (trigger as FixedDonationAmountTrigger).amount,
        );
      case "at-least-donation-amount":
        return new RangeDonationAmountTrigger(
          (trigger as RangeDonationAmountTrigger).min,
        );
      case "less-than-donation-amount":
        return new LessThanDonationAmountTrigger(
          (trigger as LessThanDonationAmountTrigger).amount,
        );
      case "system":
        return new SystemTrigger((trigger as SystemTrigger).system);
      case BOOSTY_SUBSCRIPTION_TRIGGER.type:
        return new BoostySubscriptionTrigger();
      case BOOSTY_FOLLOW_TRIGGER.type:
        return new BoostyFollowTrigger();
      default:
        return new UnknownTrigger();
    }
  }
}

export const TriggersStoreContext = createContext<TriggersStore>(
  new TriggersStore(),
);
