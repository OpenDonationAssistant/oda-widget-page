import { ReactNode } from "react";

export interface ElementContainer {
  addElement({
    data,
    parentId,
    index,
  }: {
    data: ElementData<any>;
    parentId: string | null;
    index?: number;
  }): void;
  deleteElement({ id }: { id: string }): void;
  moveDown(id: string): void;
  moveUp(id: string): void;
  elements: Element<any>[];
}

export interface ElementData<Type> {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  containerId: string | null;
  level: number;
  advanced: boolean;
  advancedLevel: number;
  settings: Type;
  order: number;
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

  public moveDown() {
    this._container?.moveDown(this.data.id);
  }

  public moveUp() {
    this._container?.moveUp(this.data.id);
  }

  markup(): ReactNode {
    return <></>;
  }
}
