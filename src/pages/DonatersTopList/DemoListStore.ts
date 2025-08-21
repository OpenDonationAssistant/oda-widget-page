import { AbstractDonatersListStore, DonaterRecord } from "./DonatersListStore";

export class DemoListStore implements AbstractDonatersListStore {
  public get list() {
    return [
      { nickname: "donater #1", amount: 30000 },
      { nickname: "donater #2", amount: 2000 },
      { nickname: "donater #3", amount: 100 },
    ];
  }
}
