import { ReactNode } from "react";
import { TriggerCause, Trigger } from "./AlertTriggerInterface";

export class TwitchSimpleTrigger implements Trigger {
  category = "twitch";

  constructor(public type: string) {}

  public get description(): string {
    return this.type;
  }

  priorityFor(event: TriggerCause): number {
    return event.type === this.type ? 0 : -1;
  }

  public markup(): ReactNode {
    return <></>;
  }
}
