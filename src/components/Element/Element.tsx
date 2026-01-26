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

  public moveUp() {
    const targetOrder = this.data.order - 1;
    const minOrder =
      this.container?.elements.find(
        (element) => element.data.id === this.data.containerId,
      )?.data.order ?? 0;
    if (targetOrder <= minOrder) {
      return;
    }
    this.container?.deleteElement({ id: this.data.id });
    this.container?.addElement({
      data: this.data,
      parentId: this.data.containerId,
      index: targetOrder,
    });
  }

  public moveDown() {
    const targetOrder = this.data.order + 1;
    const minOrder =
      this.container?.elements.find(
        (element) => element.data.id === this.data.containerId,
      )?.data.order ?? 0;
    const maxOrder =
      minOrder +
      (this.container?.elements.filter(
        (element) => element.data.containerId === this.data.containerId,
      ).length ?? 0);
    if (targetOrder >= maxOrder) {
      return;
    }
    this.container?.deleteElement({ id: this.data.id });
    this.container?.addElement({
      data: this.data,
      parentId: this.data.containerId,
      index: targetOrder,
    });
  }

  markup(): ReactNode {
    return <></>;
  }
}
