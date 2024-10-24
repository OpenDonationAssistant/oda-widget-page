import React from "react";
import { ReactNode } from "react";
import {
  action,
  comparer,
  computed,
  makeObservable,
  observable,
  toJS,
} from "mobx";
import { log } from "../../../logging";

export interface WidgetProperty<Type> {
  name: string;
  value: Type;
  displayName: string;
  markup: () => ReactNode;
  changed: boolean;
  markSaved: () => void;
}

export class DefaultWidgetProperty<Type> implements WidgetProperty<Type> {
  protected _name: string;
  protected _value: Type;
  protected _initialValue: Type;
  protected _displayName: string;
  protected _changed: boolean = false;

  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value: any;
    displayName: string;
  }) {
    this._name = name;
    this._displayName = displayName;
    this._initialValue = typeof value === "object" ? { ...value } : value;
    this._value = value;
    makeObservable(
      this,
      {
        _initialValue: observable,
        _value: observable,
        changed: computed,
        markSaved: action,
      },
      { deep: true, equals: comparer.structural },
    );
  }

  public markSaved(): void {
    const actualValue = toJS(this._value);
    this._initialValue =
      typeof actualValue === "object" ? { ...actualValue } : actualValue;
    log.debug(
      { name: this._name, initialValue: this._initialValue },
      "markSaved",
    );
  }

  markup(): ReactNode {
    return React.createElement("div");
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get value(): Type {
    return this._value;
  }
  public set value(value: Type) {
    this._value = value;
  }
  public get displayName(): string {
    return this._displayName;
  }
  public set displayName(value: string) {
    this._displayName = value;
  }

  private deepEqual(x: any, y: any): boolean {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === "object" && tx === ty
      ? ok(x).length === ok(y).length &&
          ok(x).every((key) => this.deepEqual(x[key], y[key]))
      : x === y;
  }

  public get changed(): boolean {
    const valueToCheck = this._value ?? {};
    const result = !this.deepEqual(
      toJS(valueToCheck),
      toJS(this._initialValue),
    );
    log.debug({ result: result, property: toJS(this) }, "calc changes");
    if (result) {
      log.debug(
        {
          changed: this,
          left: JSON.stringify(valueToCheck),
          right: JSON.stringify(this._initialValue),
        },
        "change detected",
      );
    }
    return result;
  }
}
