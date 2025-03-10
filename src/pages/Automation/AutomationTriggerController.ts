import { createContext } from "react";
import { AutomationTrigger } from "./AutomationState";

export class AutomationTriggerController {

  private _triggers: AutomationTrigger[] = [
    {
      id: "new-donation",
      name: "Новый донат"
    },
    {
      id: "donationgoal-filled",
      name: "Заполнен донатгол"
    }
  ];

  public get triggers() {
    return this._triggers;
  }

}

export const AutomationTriggerControllerContext = createContext(new AutomationTriggerController());
