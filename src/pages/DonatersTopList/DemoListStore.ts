import { AbstractDonatersListStore } from "./DonatersListStore";

export class DemoListStore implements AbstractDonatersListStore {
  private _sortedMap: Map<string, any> = new Map();
  constructor() {
    this._sortedMap.set("donater #1", {
      minor: 0,
      major: 30000,
      currency: "RUB",
    });
    this._sortedMap.set("donater #2", {
      minor: 0,
      major: 2000,
      currency: "RUB",
    });
    this._sortedMap.set("donater #3", {
      minor: 0,
      major: 100,
      currency: "RUB",
    });
  }

  public get sortedMap() {
    return this._sortedMap;
  }
}
