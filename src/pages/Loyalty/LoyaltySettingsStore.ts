import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { ObjectWrapper } from "../../utils";
import { useAuth } from "../../contexts/AuthContext";

export enum LoyaltyAction {
  FOLLOW = "follow",
  SUBSCRIBE = "subscribe",
  GIFT_SUB = "gift-sub",
  DONATE = "donate",
  RAID = "raid",
  CHAT_MESSAGE = "chat-message",
  WATCH_TIME = "watch-time",
}

export interface LoyaltySettingData {
  action: LoyaltyAction;
  points: number;
}

const DEFAULT_SETTINGS: LoyaltySettingData[] = [
  { action: LoyaltyAction.FOLLOW, points: 10 },
  { action: LoyaltyAction.SUBSCRIBE, points: 50 },
  { action: LoyaltyAction.GIFT_SUB, points: 50 },
  { action: LoyaltyAction.DONATE, points: 100 },
  { action: LoyaltyAction.RAID, points: 25 },
  { action: LoyaltyAction.CHAT_MESSAGE, points: 1 },
  { action: LoyaltyAction.WATCH_TIME, points: 5 },
];

export class LoyaltySetting {
  private _points: number;

  constructor(
    public readonly action: LoyaltyAction,
    points: number,
  ) {
    this._points = points;
    makeAutoObservable(this);
  }

  public get points(): number {
    return this._points;
  }

  public set points(points: number) {
    this._points = points;
  }
}

export class LoyaltySettingsStore {
  private _settings: LoyaltySetting[];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    this._settings = DEFAULT_SETTINGS.map(
      (setting) => new LoyaltySetting(setting.action, setting.points),
    );
    makeAutoObservable(this);
    this.load();
  }

  public load() {
    // TODO: implement loading of loyalty point settings
  }

  public save() {
    // TODO: implement saving of loyalty point settings
  }

  public get settings(): LoyaltySetting[] {
    return this._settings;
  }
}

export const LoyaltySettingsStoreContext =
  createContext<ObjectWrapper<LoyaltySettingsStore>>(
    new ObjectWrapper<LoyaltySettingsStore>(null),
  );

export function useLoyaltySettingsStore() {
  const { accessToken } = useAuth();
  const context = useContext(LoyaltySettingsStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error(
        "useLoyaltySettingsStore must be used within an AuthProvider",
      );
    }
    context.value = new LoyaltySettingsStore(accessToken);
  }
  return { store: context.value };
}
