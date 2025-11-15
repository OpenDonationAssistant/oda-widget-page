import { ReactNode } from "react";

export interface ElementContainer {
  deleteElement({ name }: { name?: string }): void;
}

export interface ElementData<Type> {
  name: string;
  type: string;
  settings: Type;
}

export class Element<Type> {
  private _data: ElementData<Type>;
  private _container: ElementContainer;

  constructor(
    public data: ElementData<Type>,
    public container: ElementContainer,
  ) {
    this._data = data;
    this._container = container;
  }

  public delete() {}

  markup(): ReactNode {
    return <></>;
  }
}
