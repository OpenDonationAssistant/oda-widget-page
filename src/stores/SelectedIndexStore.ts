import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class SelectedIndexStore {
  private _index: number | null = null;
  private _id: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get index() {
    return this._index;
  }

  public set index(index: number | null) {
    this._index = index;
  }

  public get id(){
    return this._id;
  }

  public set id(id: string | null){
    this._id = id;
  }
}

export const SelectedIndexContext = createContext(new SelectedIndexStore());
