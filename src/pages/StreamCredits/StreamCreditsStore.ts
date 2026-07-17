import { makeAutoObservable } from "mobx";
import { Event, EventBus } from "../../bus/EventBus";
import { onEvent } from "../../utils";

interface CreditsState {
  donaters: string[];
  newFollowers: string[];
  raiders: string[];
  gifters: string[];
  banned: string[];
  voters: string[];
  timestamp: number;
}

export class StreamCreditsStore {
  private _state: CreditsState = {
    donaters: [],
    newFollowers: [],
    raiders: [],
    gifters: [],
    banned: [],
    voters: [],
    timestamp: -1,
  };

  constructor(widgetId: string) {
    const stateKey = `stream-credits-state-${widgetId}`;
    let data = localStorage.getItem(stateKey);
    if (data) {
      this._state = JSON.parse(data) as CreditsState;
    }
    makeAutoObservable(this);
    onEvent(this.listen);
    setInterval(() => {
      localStorage.setItem(stateKey, JSON.stringify(this._state));
    }, 10000);
  }

  private listen(event: Event) {
    const state = this._state;
    if (event.type === "Alert") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!state.donaters.includes(nickname)) {
        state.donaters.push(nickname);
      }
    }
    if (event.type === "TwitchChannelFollowEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!state.newFollowers.includes(nickname)) {
        state.newFollowers.push(nickname);
      }
    }
    if (event.type === "TwitchChannelRaidEvent") {
      const nickname = String(event.get("channel")) ?? "";
      if (!state.raiders.includes(nickname)) {
        state.raiders.push(nickname);
      }
    }
    if (event.type === "TwitchChannelSubscriptionGiftEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!state.gifters.includes(nickname)) {
        state.gifters.push(nickname);
      }
    }
    if (event.type === "TwitchUserBannedEvent") {
      const nickname = String(event.get("nickname")) ?? "";
      if (!state.banned.includes(nickname)) {
        state.banned.push(nickname);
      }
    }
    state.timestamp = event.timestamp;
  }

  public get donaters() {
    return this._state.donaters;
  }

  public get newFollowers() {
    return this._state.newFollowers;
  }

  public get raiders() {
    return this._state.raiders;
  }

  public get gifters() {
    return this._state.gifters;
  }

  public get banned() {
    return this._state.banned;
  }

  public get voters() {
    return this._state.voters;
  }

  public addVoter(nickname: string) {
    if (this._state.voters.includes(nickname)) {
      return;
    }
    this._state.voters.push(nickname);
  }
}
