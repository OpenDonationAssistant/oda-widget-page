import { makeAutoObservable } from "mobx";
import { Preset } from "../../../../types/Preset";
import { createContext } from "react";
import { PaymentAlertsProperty } from "./PaymentAlertsProperty";

export class AddAlertWizardStore {
  private _preset: Preset | null = null;
  private _property: PaymentAlertsProperty | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public set preset(preset: Preset) {
    this._preset = preset;
  }

  public get preset(): Preset | null {
    return this._preset;
  }

  public set property(property: PaymentAlertsProperty) {
    this._property = property;
  }

  public get property(): PaymentAlertsProperty | null {
    return this._property;
  }

  public reset(){
    this._preset = null;
  }
}

export const AddAlertWizardStoreContext = createContext<AddAlertWizardStore>(
  new AddAlertWizardStore(),
);
