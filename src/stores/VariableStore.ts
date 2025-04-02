import { DefaultApiFactory } from "@opendonationassistant/oda-automation-service-client";
import { Variable } from "../pages/Automation/AutomationState";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export interface VariableStore {
  variables: Variable[];
  processTemplate: (template: string) => string;
}

export class DefaultVariableStore {
  private _variables: Variable[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
    );
  }

  public load() {
    this.client()
      .listVariables({})
      .then(
        (response) =>
          (this._variables = response.data.map((variable) => {
            return {
              name: variable.name,
              type: "string",
              value: variable.value,
              id: variable.id,
            };
          })),
      );
  }

  public get variables() {
    return this._variables;
  }

  public processTemplate(template: string): string {
    let result = template;
    this._variables.forEach((variable) => {
      result = result.replace(`<${variable.name}>`, String(variable.value));
    });
    return result;
  }
}

export const VariableStoreContext = createContext<VariableStore>({
  variables: [],
  processTemplate: (template: string) => template,
});
