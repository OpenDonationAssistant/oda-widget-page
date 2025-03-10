import { makeAutoObservable } from "mobx";
import { WidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { AutomationActionController } from "./AutomationActionController";
import { AutomationTriggerController } from "./AutomationTriggerController";

export interface AutomationTrigger {
  id: string;
  name: string;
}

export interface AutomationAction {
  id: string;
  name: string;
  properties: WidgetProperty<any>[];
}

export interface AutomationRule {
  name: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
}

export class AutomationState {
  private _rules: AutomationRule[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addRule(): void {
    this._rules.push({
      name: "Без названия",
      triggers: [],
      actions: []
    });
  }

  public get rules(): AutomationRule[] {
    return this._rules;
  }
}
