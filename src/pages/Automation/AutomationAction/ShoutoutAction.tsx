import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { makeAutoObservable } from "mobx";

interface ShoutoutActionValue {}

export class ShoutoutAction implements AutomationAction, Renderable {
  id = "shoutout";
  name = "Сделать Twitch Shoutout";
  markup: ReactNode = (<></>);
  value: ShoutoutActionValue = {};

  constructor() {
    makeAutoObservable(this);
  }
}
