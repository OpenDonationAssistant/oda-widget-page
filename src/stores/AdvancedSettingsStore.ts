import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AdvancedSettingsStore {
  constructor(public enabled: boolean = false) {
    makeAutoObservable(this);
  }
}

export const AdvancedSettingsStoreContext = createContext(
  new AdvancedSettingsStore(),
);
