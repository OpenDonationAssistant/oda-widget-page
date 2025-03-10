import { makeAutoObservable } from "mobx";

export interface AutomationTrigger {
  name: string;
}

export interface AutomationRule {
  name: string;
  triggers: AutomationTrigger[];
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
    });
  }

  public get rules(): AutomationRule[] {
    return this._rules;
  }
}
