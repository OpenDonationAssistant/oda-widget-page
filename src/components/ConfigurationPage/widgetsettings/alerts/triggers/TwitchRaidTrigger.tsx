import { makeAutoObservable } from "mobx";
import { DonationEvent, Trigger } from "./AlertTriggerInterface";
import { ReactNode } from "react";

export const TWITCH_RAID_TRIGGER = {
  description: "Twitch Raid",
  type: "twitch_raid",
};

export class TwitchRaidTrigger implements Trigger {
  type = TWITCH_RAID_TRIGGER.type;
  description = TWITCH_RAID_TRIGGER.description;

  constructor() {
    makeAutoObservable(this);
  }

  isTriggered(event: DonationEvent): boolean {
    return event.system === "Twitch" && event.event === "raid";
  }

  public compare(other: Trigger): number {
    return 0;
  }

  markup(): ReactNode {
    return <></>;
  }
}
