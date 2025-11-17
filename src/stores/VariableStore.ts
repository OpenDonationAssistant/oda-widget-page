import { DefaultApiFactory } from "@opendonationassistant/oda-automation-service-client";
import { Variable } from "../pages/Automation/AutomationState";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { log } from "../logging";

export interface VariableStore {
  variables: Variable[];
  processTemplate: (template: string) => string;
  load: () => void;
}

export class DefaultVariableStore implements VariableStore {
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
    if (!template) {
      log.debug("template for processing is null");
      return template;
    }
    let result = template;
    this._variables.forEach((variable) => {
      if (!variable) {
        log.debug("variable is null in processing");
        return;
      }
      result = result.replace(`<${variable.name}>`, String(variable.value));
    });
    return result;
  }
}

export const VariableStoreContext = createContext<VariableStore>({
  variables: [],
  processTemplate: (template: string) => template,
  load: () => {},
});
