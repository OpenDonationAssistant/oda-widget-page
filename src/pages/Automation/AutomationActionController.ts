import { createContext } from "react";
import { AutomationAction } from "./AutomationState";

export class AutomationActionController {
  private _actions: AutomationAction[] = [
    {
      name: "Запустить алерт",
      id: "run-alert",
      properties: []
    },
    {
      name: "Обновить донатгол",
      id: "update-donationgoal",
      properties: []
    }
  ];

  public get actions(){
    return this._actions;
  }
}

export const AutomationActionControllerContext = createContext(new AutomationActionController());
