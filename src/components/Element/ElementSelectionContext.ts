import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export const ELEMENTS_SECTION_KEY = "elements";

export class ElementSelectionStore {
  private _id: string | null = null;
  private _section: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get id(): string | null {
    return this._id;
  }

  public get section(): string | null {
    return this._section;
  }

  public select(id: string, section: string = ELEMENTS_SECTION_KEY): void {
    this._id = id;
    this._section = section;
  }

  public toggle(id: string, section: string = ELEMENTS_SECTION_KEY): void {
    this._id = this._id === id ? null : id;
    this._section = section;
  }

  public setSection(section: string | null): void {
    this._section = section;
  }
}

export const ElementSelectionContext =
  createContext<ElementSelectionStore | null>(null);

export function useElementSelection(): ElementSelectionStore | null {
  return useContext(ElementSelectionContext);
}
