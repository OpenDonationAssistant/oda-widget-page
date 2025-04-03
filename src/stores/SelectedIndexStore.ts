import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class SelectedIndexStore {
  private _index: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get index() {
    return this._index;
  }

  public set index(index: number | null) {
    this._index = index;
  }
}

export const SelectedIndexContext = createContext(new SelectedIndexStore());
