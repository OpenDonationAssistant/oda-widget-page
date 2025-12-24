import { ReactNode } from "react";

export interface ElementContainer {
  deleteElement({ id }: { id: string }): void;
  elements: Element<any>[];
}

export interface ElementData<Type> {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  containerId: string | null;
  settings: Type;
}

export class Element<Type> {
  private _data: ElementData<Type>;
  private _container: ElementContainer | null;
  private _children: Element<any>[];

  constructor(
    public data: ElementData<Type>,
    public container: ElementContainer | null,
  ) {
    this._data = data;
    this._container = container;
    this._children = [];
  }

  public addChild(element: Element<any>) {
    this._children.push(element);
  }

  public get children(): Element<any>[] {
    return this._children;
  }

  public delete() {
    this._container?.deleteElement({ id: this._data.id });
  }

  markup(): ReactNode {
    return <></>;
  }
}
