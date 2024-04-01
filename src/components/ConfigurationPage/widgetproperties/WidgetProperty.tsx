import React from "react";
import { ReactNode } from "react";

export interface WidgetProperty {
  widgetId: string | null;
  name: string;
  type: string;
  value: any;
  displayName: string;
  tab?: string;
  markup: () => ReactNode;
  copy: () => WidgetProperty;
}

export class DefaultWidgetProperty {
  private _widgetId: string;
  private _name: string;
  private _type: string;
  private _value: any;
  private _displayName: string;
  private _tab?: string | undefined;

  constructor(
    widgetId: string,
    name: string,
    type: string,
    value: any,
    displayName: string,
    tab?: string | undefined,
  ) {
    this._widgetId = widgetId;
    this._name = name;
    this._type = type;
    this._displayName = displayName;
    this._value = value;
    this._tab = tab;
  }

  markup(): ReactNode {
    return React.createElement("div");
  }

  copy() {
    return new DefaultWidgetProperty(
      this._widgetId,
      this._name,
      this._type,
      this._value,
      this._displayName,
      this._tab,
    );
  }
  public get widgetId(): string {
    return this._widgetId;
  }
  public set widgetId(value: string) {
    this._widgetId = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get type(): string {
    return this._type;
  }
  public set type(value: string) {
    this._type = value;
  }
  public get value(): any {
    return this._value;
  }
  public set value(value: any) {
    this._value = value;
  }
  public get displayName(): string {
    return this._displayName;
  }
  public set displayName(value: string) {
    this._displayName = value;
  }
  public get tab(): string | undefined {
    return this._tab;
  }
  public set tab(value: string | undefined) {
    this._tab = value;
  }
}
