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
import { TwitchSimpleTrigger } from "./TwitchSimpleTrigger";

export class TriggersStore {
  private _types: TriggerType[] = [
    FIXED_DONATION_AMOUNT_TRIGGER,
    RANDE_DONATION_AMOUNT_TRIGGER,
    LESS_THAN_DONATION_AMOUNT_TRIGGER,
    SYSTEM_TRIGGER,
    UNKNOWN_TRIGGER,
    {
      type: "TwitchChannelCheerEvent",
      description: "Twitch Cheer",
      category: "twitch",
    },
    {
      type: "TwitchChannelFollowEvent",
      description: "Twitch Follow",
      category: "twitch",
    },
    {
      type: "TwitchChannelRaidEvent",
      description: "Twitch Raid",
      category: "twitch",
    },
    {
      type: "TwitchChannelSubscribeEvent",
      description: "Twitch Subscribe",
      category: "twitch",
    },
    {
      type: "TwitchChannelSubscriptionGift",
      description: "Twitch Subscription Gift",
      category: "twitch",
    },
  ];
  private _added: Trigger[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public getType(type: string): TriggerType | undefined {
    return this._types.find((t) => t.type === type);
  }

  public available(added: Trigger[]): TriggerType[] {
    const additionalFilters: ((t: TriggerType) => boolean)[] = [];
    added.forEach((a) => {
      additionalFilters.push(
        (checked: TriggerType) => checked.category === a.category,
      );
      if (a.category === "twitch") {
        additionalFilters.push((checked: TriggerType) => false);
      }
      if (a.type === FIXED_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== RANDE_DONATION_AMOUNT_TRIGGER.type,
        );
        additionalFilters.push(
          (t: TriggerType) => t.type !== LESS_THAN_DONATION_AMOUNT_TRIGGER.type,
        );
      }
      if (a.type === RANDE_DONATION_AMOUNT_TRIGGER.type) {
        additionalFilters.push(
          (t: TriggerType) => t.type !== FIXED_DONATION_AMOUNT_TRIGGER.type,
        );
      }
      if (a.type === LESS_THAN_DONATION_AMOUNT_TRIGGER.type) {
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
      case "TwitchChannelCheerEvent":
      case "TwitchChannelFollowEvent":
      case "TwitchChannelPollBeginEvent":
      case "TwitchChannelRaidEvent":
      case "TwitchChannelSubscribeEvent":
      case "TwitchChannelSubscriptionGift":
      case "TwitchChannelSubscriptionGiftEvent":
      case "TwitchChannelSubscriptionMessageEvent":
        return new TwitchSimpleTrigger(type);
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
      case "TwitchChannelCheerEvent":
      case "TwitchChannelFollowEvent":
      case "TwitchChannelPollBeginEvent":
      case "TwitchChannelRaidEvent":
      case "TwitchChannelSubscribeEvent":
      case "TwitchChannelSubscriptionGift":
      case "TwitchChannelSubscriptionGiftEvent":
      case "TwitchChannelSubscriptionMessageEvent":
        return new TwitchSimpleTrigger(trigger.type);
      default:
        return new UnknownTrigger();
    }
  }
}

export const TriggersStoreContext = createContext<TriggersStore>(
  new TriggersStore(),
);
