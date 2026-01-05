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
  type: string;
  nested?: VariableDescription[];
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
  getValue(
    name: string,
    defaultValue: string | number | Array<Variable> | Array<Array<Variable>>,
  ): string | number | Array<Variable> | Array<Array<Variable>>;
  processTemplate: (template: string) => DynamicText;
  load(): void;
  clone(): VariableStore;
}

interface TextProvider {
  value: string | number | Array<Variable> | Array<Array<Variable>>;
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
  private _variables: Variable[];

  constructor(variables?: Variable[]) {
    this._variables = variables ?? [];
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

  public clone(): VariableStorage {
    return new VariableStorage([...this._variables]);
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
  private _storage: VariableStorage;
  private _templates: LabelTemplate[];
  private _descriptions: VariableDescription[];
  private _processor: DefaultTemplateProcessor;

  constructor(
    storage?: VariableStorage,
    templates?: LabelTemplate[],
    descriptions?: VariableDescription[],
  ) {
    this._storage = storage ?? new VariableStorage();
    this._templates = templates ?? [];
    this._descriptions = descriptions ?? [];
    this._processor = new DefaultTemplateProcessor(this._storage);
    makeAutoObservable(this);
  }
  getValue(
    name: string,
    defaultValue: string | number | Variable[] | Variable[][],
  ): string | number | Variable[] | Variable[][] {
    const variable = this._storage.variables.find((item) => item.name === name);
    return variable?.value ?? defaultValue;
  }

  public get templating(): TemplateSettings {
    return { variables: this._descriptions, templates: [] };
  }

  public addTemplate(template: LabelTemplate): void {}

  public addVariableDescription(variable: VariableDescription): void {
    const existed = this._descriptions.find(
      (description) => description.name === variable.name,
    );
    if (existed) {
      existed.nested = variable.nested;
      existed.description = variable.description;
      existed.type = variable.type;
    } else {
      this._descriptions.push(variable);
    }
  }

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
  public clone(): VariableStore {
    return new LocalVariableStore(this._storage.clone(), this._templates, [
      ...this._descriptions,
    ]);
  }
}

export class DefaultVariableStore implements VariableStore {
  private _storage: VariableStorage;
  private _processor: TemplateProcessor;

  constructor(storage?: VariableStorage) {
    this._storage = storage ?? new VariableStorage();
    this._processor = new DefaultTemplateProcessor(this._storage);
    makeAutoObservable(this);
    this.load();
  }
  getValue(
    name: string,
    defaultValue: string | number | Variable[] | Variable[][],
  ): string | number | Variable[] | Variable[][] {
    const variable = this._storage.variables.find((item) => item.name === name);
    return variable?.value ?? defaultValue;
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

  public clone(): VariableStore {
    return new DefaultVariableStore(this._storage.clone());
  }
}

export const VariableStoreContext = createContext<VariableStore>(
  new LocalVariableStore(),
);
