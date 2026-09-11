import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { uuidv7 } from "uuidv7";
import { ObjectWrapper } from "../../utils";
import { useAuth } from "../../contexts/AuthContext";
import { ListItemData, ListItemsStore } from "../../components/List/FilledList";
import { CardData, CardsStore } from "../../components/Cards/FilledCards";

export class Reward implements ListItemData, CardData {
  private _id: string;
  private _title: string;
  private _enabled: boolean;

  constructor(id?: string, title: string = "Без названия") {
    this._id = id ?? uuidv7();
    this._title = title;
    this._enabled = true;
    makeAutoObservable(this);
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get enabled() {
    return this._enabled;
  }

  public set enabled(enabled: boolean) {
    this._enabled = enabled;
  }
}

export class RewardsStore implements ListItemsStore, CardsStore {
  private _rewards: Reward[] = [];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    makeAutoObservable(this);
    this.load();
  }

  public load() {
    // TODO: implement loading of rewards
  }

  public save() {
    // TODO: implement saving of rewards
  }

  public get items(): Reward[] {
    return this._rewards;
  }

  public remove(id: string) {
    const index = this._rewards.findIndex((reward) => reward.id === id);
    if (index >= 0) {
      this._rewards.splice(index, 1);
    }
  }
}

export const RewardsStoreContext = createContext<ObjectWrapper<RewardsStore>>(
  new ObjectWrapper<RewardsStore>(null),
);

export function useRewardsStore() {
  const { accessToken } = useAuth();
  const context = useContext(RewardsStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error("useRewardsStore must be used within an AuthProvider");
    }
    context.value = new RewardsStore(accessToken);
  }
  return { store: context.value };
}
