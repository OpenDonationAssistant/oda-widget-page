import React from "react";
import { ReactNode } from "react";
import {
  action,
  autorun,
  comparer,
  computed,
  getObserverTree,
  makeObservable,
  observable,
  reaction,
} from "mobx";
import { log } from "../../../logging";

export interface WidgetProperty<Type> {
  name: string;
  value: Type;
  displayName: string;
  markup: () => ReactNode;
  changed: () => boolean;
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
    this._initialValue = structuredClone(value);
    this._value = value;
    makeObservable(
      this,
      {
        _value: observable,
        changed: computed,
        checkChanged: action,
      },
      { deep: true, equals: comparer.structural },
    );
  }

  public checkChanged(): void {
    log.debug("checkChanged");
    // log.debug({
    //   _value: this._value,
    //   _initialValue: this._initialValue,
    //   changed:
    //     JSON.stringify(this._value) !== JSON.stringify(this._initialValue),
    // });
    // log.debug({checkChangedTree: getObserverTree(this, "changed")});
    // this._changed = JSON.stringify(this._value) !== JSON.stringify(this._initialValue);
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
    this.checkChanged();
  }
  public get displayName(): string {
    return this._displayName;
  }
  public set displayName(value: string) {
    this._displayName = value;
  }
  public get changed() {
    return JSON.stringify(this._value) !== JSON.stringify(this._initialValue);
  }
}
