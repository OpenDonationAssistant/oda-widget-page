import { DefaultApiFactory } from "@opendonationassistant/oda-automation-service-client";
import { Variable } from "../pages/Automation/AutomationState";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { log } from "../logging";

export interface LabelTemplate {
  value: string;
  description: string;
  example: string;
}

export interface VariableDescription {
  name: string;
  description: string;
}

export interface TemplateSettings {
  variables: VariableDescription[];
  templates: LabelTemplate[];
}

export interface VariableStore {
  variables: Variable[];
  templating: TemplateSettings;
  addTemplate(template: LabelTemplate): void;
  addVariable(variable: Variable): void;
  addVariableDescription(variable: VariableDescription): void;
  processTemplate: (template: string) => DynamicText;
  load: () => void;
}

interface TextProvider {
  value: string | number;
}

export class DynamicText {
  private _parts: TextProvider[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addPart(part: TextProvider) {
    this._parts.push(part);
  }

  public get parts() {
    return this._parts;
  }

  public get text() {
    let result = "";
    this._parts.forEach((part) => {
      result += part.value;
    });
    return result;
  }
}

class VariableStorage {
  private _variables: Variable[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addVariable(variable: Variable): void {
    const existing = this._variables.find(
      (item) => item.name === variable.name,
    );
    if (existing) {
      existing.value = variable.value;
    } else {
      this._variables.push(variable);
    }
  }

  public get variables() {
    return this._variables;
  }
}

interface TemplateProcessor {
  processTemplate: (template: string) => DynamicText;
}

class DefaultTemplateProcessor implements TemplateProcessor {
  constructor(private _context: { variables: Variable[] }) {}
  public processTemplate(template: string) {
    const result = new DynamicText();
    if (!template) {
      log.debug("template for processing is null");
      return result;
    }
    let part = "";
    let variableName: string = "";
    let inTemplate = false;
    let escape = false;
    for (const char of Array.from(template)) {
      if (escape) {
        escape = false;
        part += char;
        continue;
      }
      if (char === "\\") {
        escape = true;
        continue;
      }
      if (char === "<") {
        result.addPart({ value: part });
        part = "";
        inTemplate = true;
        continue;
      }
      if (char === ">") {
        const usedVariable = this._context.variables.find(
          (variable) => variable.name === variableName,
        );
        if (usedVariable) {
          result.addPart(usedVariable);
        }
        variableName = "";
        inTemplate = false;
        continue;
      }
      if (inTemplate) {
        variableName += char;
      } else {
        part += char;
      }
    }
    if (part) {
      result.addPart({ value: part });
    }
    return result;
  }
}

class LocalVariableStore implements VariableStore {
  private _storage = new VariableStorage();

  constructor() {
    makeAutoObservable(this);
  }

  private _processor: TemplateProcessor = new DefaultTemplateProcessor(
    this._storage,
  );
  public templating: TemplateSettings = { variables: [], templates: [] };
  public addTemplate(template: LabelTemplate): void {}

  public addVariableDescription(variable: VariableDescription): void {}

  public addVariable(variable: Variable): void {
    this._storage.addVariable(variable);
  }

  public get variables(): Variable[] {
    return this._storage.variables;
  }

  public processTemplate(template: string): DynamicText {
    return this._processor.processTemplate(template);
  }

  public load(): void {}
}

export class DefaultVariableStore implements VariableStore {
  private _storage: VariableStorage = new VariableStorage();
  private _processor: TemplateProcessor = new DefaultTemplateProcessor(
    this._storage,
  );

  constructor() {
    makeAutoObservable(this);
    this.load();
  }
  templating: TemplateSettings = { variables: [], templates: [] };
  addTemplate(template: LabelTemplate): void {
    throw new Error("Method not implemented.");
  }
  addVariableDescription(variable: VariableDescription): void {
    throw new Error("Method not implemented.");
  }

  public processTemplate(template: string) {
    return this._processor.processTemplate(template);
  }

  public addVariable(variable: Variable): void {
    this._storage.addVariable(variable);
  }
  public get variables(): Variable[] {
    return this._storage.variables;
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
      .then((response) =>
        response.data.forEach((variable) => {
          this._storage.addVariable({
            name: variable.name,
            type: "string",
            value: variable.value,
            id: variable.id,
          });
        }),
      );
  }
}

export const VariableStoreContext = createContext<VariableStore>(
  new LocalVariableStore(),
);
