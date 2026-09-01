import { makeAutoObservable, toJS } from "mobx";
import { ObjectWrapper, Renderable } from "../../utils";
import { log } from "../../logging";
import { uuidv7 } from "uuidv7";
import { createContext, useContext } from "react";
import {
  getState,
  setState as setAutomationState,
  type AutomationRuleDto,
  type AutomationVariableDto,
} from "@opendonationassistant/automation-service";
import { AutomationActionController } from "./AutomationActionController";
import { AutomationTriggerController } from "./AutomationTriggerController";
import { useAuth } from "../../contexts/AuthContext";

export interface Variable {
  name: string;
  type: "string" | "number";
  value: string | number;
  id: string;
}

export interface AutomationTrigger {
  id: string | null;
  name: string | null;
  value: any;
}

export interface AutomationAction {
  id: string | null;
  name: string | null;
  value: any;
}

export class AutomationRule {
  private _id: string;
  private _name: string = "Без названия";
  private _triggers: (AutomationTrigger & Renderable)[] = [];
  private _actions: (AutomationAction & Renderable)[] = [];

  constructor(id?: string) {
    this._id = id ?? uuidv7();
    makeAutoObservable(this);
  }

  public addTrigger(trigger?: AutomationTrigger & Renderable) {
    if (trigger) {
      this._triggers.push(trigger);
    } else {
      this._triggers.push({ id: null, name: null, markup: null, value: null });
    }
  }

  public get id() {
    return this._id;
  }

  public setTrigger(
    trigger: (AutomationTrigger & Renderable) | null,
    index: number,
  ) {
    if (trigger === null || trigger === undefined) {
      return;
    }
    this._triggers.splice(index, 1, trigger);
  }

  public removeTrigger(index: number) {
    this._triggers.splice(index, 1);
  }

  public addAction(action?: AutomationAction & Renderable) {
    if (action) {
      this._actions.push(action);
    } else {
      this._actions.push({ id: null, name: null, markup: null, value: null });
    }
  }

  public setAction(
    action: (AutomationAction & Renderable) | null,
    index: number,
  ) {
    if (action === null || action === undefined) {
      return;
    }
    this._actions.splice(index, 1, action);
  }

  public removeAction(index: number) {
    this._actions.splice(index, 1);
  }

  public get name() {
    return this._name;
  }

  public get actions() {
    return this._actions;
  }

  public get triggers() {
    return this._triggers;
  }

  public set name(name: string) {
    this._name = name;
  }
}

export class AutomationState {
  private _variables: Variable[] = [];
  private _rules: AutomationRule[] = [];
  private actions = new AutomationActionController();
  private triggers = new AutomationTriggerController();
  private _token: string;

  constructor(token: string, load?: boolean) {
    console.log("Construction new AutomationState");
    makeAutoObservable(this);
    this._token = token;
    load && this.load();
  }

  public load() {
    log.debug("loading automation state");
    getState({
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    }).then((response) => {
      if (response.error) {
        log.error(response.error, "failed to load automation state");
        return;
      }
      log.debug({ response: response }, "automation loaded");
      const data = response.data as
        | { rules?: AutomationRuleDto[]; variables?: AutomationVariableDto[] }
        | undefined;
      const convertedRules =
        data?.rules?.map((rule) => {
          const converted = new AutomationRule(rule.id);
          converted.name = rule.name ?? "";
          rule.actions?.forEach((action) => {
            const found = this.actions.get(action.id);
            if (found) {
              found.value = action.value;
            }
            converted.addAction(found);
          });
          rule.triggers?.forEach((trigger) => {
            const found = this.triggers.get(trigger.id);
            if (found) {
              found.value = trigger.value;
            }
            converted.addTrigger(found);
          });
          return converted;
        }) ?? [];
      log.debug({ rules: convertedRules }, "rules after conversion");
      this.rules = convertedRules;
      this._variables =
        data?.variables?.map((variable) => {
          return {
            name: variable.name,
            type: "number" === variable.type ? "number" : "string",
            value: variable.value,
            id: variable.id,
          };
        }) ?? [];
    });
  }

  public addRule(): void {
    this._rules.push(new AutomationRule());
  }

  public removeRule(index: number) {
    this._rules.splice(index, 1);
    log.debug({ index: index, newstate: this._rules }, "deleting rule");
  }

  public set rules(rules: AutomationRule[]) {
    this._rules = rules;
  }

  public get rules(): AutomationRule[] {
    return this._rules;
  }

  public addVariable(type: "string" | "number") {
    this._variables.push({
      name: "",
      type: type,
      value: type === "string" ? "" : 0,
      id: uuidv7(),
    });
  }

  public removeVariable(id: string) {
    const index = this._variables.findIndex((item) => item.id === id);
    this._variables.splice(index, 1);
  }

  public get variables(): Variable[] {
    return this._variables;
  }

  public save() {
    setAutomationState({
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: {
        rules: this.rules.map((rule) => {
          return {
            id: rule.id,
            name: rule.name,
            enabled: false,
            triggers: rule.triggers.map((trigger) => {
              return { id: trigger.id ?? uuidv7(), value: toJS(trigger.value) };
            }),
            actions: rule.actions.map((action) => {
              return { id: action.id ?? uuidv7(), value: toJS(action.value) };
            }),
          };
        }),
        variables: this.variables.map((variable) => {
          return {
            id: variable.id,
            name: variable.name,
            value: String(variable.value),
            type: variable.type,
          };
        }),
      },
    });
  }
}

export const AutomationStateContext = createContext<
  ObjectWrapper<AutomationState>
>(new ObjectWrapper<AutomationState>(null));

export function useAutomationState() {
  const { accessToken } = useAuth();
  const context = useContext(AutomationStateContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error("useAutomationState must be used within an AuthProvider");
    }
    context.value = new AutomationState(accessToken, true);
  }
  return { state: context.value };
}
