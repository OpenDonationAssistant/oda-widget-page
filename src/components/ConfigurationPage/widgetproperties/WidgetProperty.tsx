import React from "react";
import { ReactNode } from "react";
import { Notifier } from "../Notifier";
import { makeObservable, observable, reaction } from "mobx";

export interface WidgetProperty<Type> {
  name: string;
  value: Type;
  displayName: string;
  markup: () => ReactNode;
}

export class DefaultWidgetProperty<Type> implements WidgetProperty<Type> {
  private _name: string;
  public value: Type;
  private _displayName: string;
  private _notifier: Notifier;

  constructor({
    name,
    value,
    displayName,
    notifier,
  }: {
    name: string;
    value: any;
    displayName: string;
    notifier: Notifier;
  }) {
    this._name = name;
    this._displayName = displayName;
    this.value = value;
    this._notifier = notifier;
    makeObservable(this, {
      value: observable,
    });
    reaction(() => this.value, () => {
      this._notifier.notify();
    });
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
  public get displayName(): string {
    return this._displayName;
  }
  public set displayName(value: string) {
    this._displayName = value;
  }
}
