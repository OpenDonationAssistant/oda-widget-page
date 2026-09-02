import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import { makeAutoObservable } from "mobx";

interface ShoutoutActionValue {}

export class ShoutoutAction implements AutomationAction, Renderable {
  id = "twitch-shoutout";
  name = "Сделать Twitch Shoutout";
  markup: ReactNode = (<></>);
  value: ShoutoutActionValue = {};

  constructor() {
    makeAutoObservable(this);
  }
}
