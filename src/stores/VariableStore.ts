import {
  listVariables,
  type AutomationVariableDto,
} from "@opendonationassistant/automation-service";
import { Variable } from "../pages/Automation/AutomationState";
import { makeAutoObservable } from "mobx";
import { useState } from "react";
import { log } from "../logging";
import { useAuth } from "../contexts/AuthContext";

export interface VariableStore {
  variables: Variable[];
  processTemplate: (template: string) => string;
  load: () => void;
}

export class DefaultVariableStore implements VariableStore {
  private _variables: Variable[] = [];
  private _token: string;

  constructor(token: string) {
    makeAutoObservable(this);
    this._token = token;
    this.load();
  }

  public load() {
    listVariables({
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    }).then((response) => {
      if (response.error) {
        log.error(response.error, "failed to load variables");
        return;
      }
      this._variables = ((response.data ?? []) as AutomationVariableDto[]).map(
        (variable) => {
          return {
            name: variable.name,
            type: "string",
            value: variable.value,
            id: variable.id,
          };
        },
      );
    });
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

export function useVariableStore() {
  const { accessToken } = useAuth();
  const [variablesStore, setVariablesStore] = useState(
    () => new DefaultVariableStore(accessToken ?? ""),
  );
  return { variablesStore };
}
