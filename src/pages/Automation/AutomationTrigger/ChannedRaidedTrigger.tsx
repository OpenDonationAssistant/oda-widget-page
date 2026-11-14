import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationTrigger } from "../AutomationState";
import { makeAutoObservable } from "mobx";

export class ChannelRaidedTrigger implements AutomationTrigger, Renderable {
  id = "channel-raided";
  name = "automation-trigger-channel-raided";
  value: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  public get markup(): ReactNode {
    return <></>;
  }
}
