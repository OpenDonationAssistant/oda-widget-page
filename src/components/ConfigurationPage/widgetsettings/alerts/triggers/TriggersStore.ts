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

export class TriggersStore {
  private _types: TriggerType[] = [
    FIXED_DONATION_AMOUNT_TRIGGER,
    RANDE_DONATION_AMOUNT_TRIGGER,
    LESS_THAN_DONATION_AMOUNT_TRIGGER,
    SYSTEM_TRIGGER,
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
      if (t.type === FIXED_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== RANDE_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== LESS_THAN_DONATION_AMOUNT_TRIGGER.type,
        );
      }
      if (t.type === RANDE_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== FIXED_DONATION_AMOUNT_TRIGGER.type,
        );
      }
      if (t.type === LESS_THAN_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== FIXED_DONATION_AMOUNT_TRIGGER.type,
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
      default:
        return new UnknownTrigger();
    }
  }
}

export const TriggersStoreContext = createContext<TriggersStore>(
  new TriggersStore(),
);
