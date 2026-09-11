import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { ObjectWrapper } from "../../utils";
import { useAuth } from "../../contexts/AuthContext";

export enum LoyaltyPlatform {
  TWITCH = "twitch",
  VKLIVE = "vklive",
  KICK = "kick",
}

// TODO: remove demo data once load() is implemented
const DEMO_VIEWERS: LoyaltyViewerData[] = [
  { id: "demo-1", nickname: "alice", platform: LoyaltyPlatform.TWITCH, points: 2100 },
  { id: "demo-2", nickname: "luna", platform: LoyaltyPlatform.VKLIVE, points: 1580 },
  { id: "demo-3", nickname: "streamer_fan", platform: LoyaltyPlatform.TWITCH, points: 1250 },
  { id: "demo-4", nickname: "kick_master", platform: LoyaltyPlatform.KICK, points: 890 },
  { id: "demo-5", nickname: "vk_viewer", platform: LoyaltyPlatform.VKLIVE, points: 640 },
  { id: "demo-6", nickname: "nightbot_fan", platform: LoyaltyPlatform.TWITCH, points: 320 },
  { id: "demo-7", nickname: "zombi", platform: LoyaltyPlatform.KICK, points: 75 },
  { id: "demo-8", nickname: "bobby", platform: LoyaltyPlatform.VKLIVE, points: 45 },
];

export interface LoyaltyViewerData {
  id: string;
  nickname: string;
  platform: LoyaltyPlatform;
  points: number;
}

export class LoyaltyViewer {
  private _nickname: string;
  private _points: number;

  constructor(
    public readonly id: string,
    nickname: string,
    public readonly platform: LoyaltyPlatform,
    points: number,
  ) {
    this._nickname = nickname;
    this._points = points;
    makeAutoObservable(this);
  }

  public get nickname(): string {
    return this._nickname;
  }

  public set nickname(nickname: string) {
    this._nickname = nickname;
  }

  public get points(): number {
    return this._points;
  }

  public set points(points: number) {
    this._points = points;
  }
}

export class LoyaltyStore {
  private _viewers: LoyaltyViewer[];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    this._viewers = DEMO_VIEWERS.map(
      (viewer) =>
        new LoyaltyViewer(
          viewer.id,
          viewer.nickname,
          viewer.platform,
          viewer.points,
        ),
    );
    makeAutoObservable(this);
    this.load();
  }

  public load() {
    // TODO: implement loading of loyalty viewers
  }

  public save() {
    // TODO: implement saving of loyalty viewers
  }

  public get viewers(): LoyaltyViewer[] {
    return this._viewers;
  }
}

export const LoyaltyStoreContext = createContext<ObjectWrapper<LoyaltyStore>>(
  new ObjectWrapper<LoyaltyStore>(null),
);

export function useLoyaltyStore() {
  const { accessToken } = useAuth();
  const context = useContext(LoyaltyStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error("useLoyaltyStore must be used within an AuthProvider");
    }
    context.value = new LoyaltyStore(accessToken);
  }
  return { store: context.value };
}
