import { makeAutoObservable } from "mobx";
import { Event, EventBus } from "../../bus/EventBus";

export class StreamCreditsStore {
  private _donaters: string[] = [];
  private _newFollowers: string[] = [];
  private _raiders: string[] = [];
  private _gifters: string[] = [];
  private _banned: string[] = [];

  constructor(bus: EventBus) {
    let data = localStorage.getItem("streamCredits");
    if (data) {
      let parsed = JSON.parse(data);
      this._donaters = parsed.donaters ?? [];
      this._newFollowers = parsed.newFollowers ?? [];
      this._raiders = parsed.raiders ?? [];
      this._gifters = parsed.gifters ?? [];
      this._banned = parsed.banned ?? [];
    }
    makeAutoObservable(this);
    bus.addListener((event) => this.listen(event));
    setInterval(() => {
      localStorage.setItem(
        "streamCredits",
        JSON.stringify({
          donaters: this._donaters,
          newFollowers: this._newFollowers,
          raiders: this._raiders,
          gifters: this._gifters,
          banned: this._banned,
        }),
      );
    }, 5000);
  }

  private listen(event: Event) {
    if (event.type === "Alert") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!this._donaters.includes(nickname)) {
        this._donaters.push(nickname);
      }
    }
    if (event.type === "TwitchChannelFollowEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!this._newFollowers.includes(nickname)) {
        this._newFollowers.push(nickname);
      }
    }
    if (event.type === "TwitchChannelRaidEvent") {
      const nickname = String(event.get("channel")) ?? "";
      if (!this._raiders.includes(nickname)) {
        this._raiders.push(nickname);
      }
    }
    if (event.type === "TwitchChannelSubscriptionGiftEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!this._gifters.includes(nickname)) {
        this._gifters.push(nickname);
      }
    }
    if (event.type === "TwitchUserBannedEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!this._banned.includes(nickname)) {
        this._banned.push(nickname);
      }
    }
  }

  public get donaters() {
    return this._donaters;
  }

  public get newFollowers() {
    return this._newFollowers;
  }

  public get raiders() {
    return this._raiders;
  }

  public get gifters() {
    return this._gifters;
  }

  public get banned() {
    return this._banned;
  }
}
