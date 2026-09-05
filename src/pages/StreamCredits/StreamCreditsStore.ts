import { makeAutoObservable } from "mobx";
import { Event } from "../../bus/EventBus";
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
  private stateKey: string;

  constructor(widgetId: string) {
    this.stateKey = `stream-credits-state-${widgetId}`;
    this.load();
    makeAutoObservable(this);
    onEvent((event) => this.listen(event));
    setInterval(() => {
      this.save();
    }, 10000);
  }

  private load() {
    let data = localStorage.getItem(this.stateKey);
    if (data) {
      this._state = JSON.parse(data) as CreditsState;
    }
  }

  private save() {
    localStorage.setItem(this.stateKey, JSON.stringify(this._state));
  }

  private listen(event: Event) {
    if (event.type === "TwitchStreamStartedEvent") {
      this.clear();
      return;
    }
    const state = this._state;
    if (
      event.type === "TWITCH_CHAT_MESSAGE" ||
      event.type === "VKLIVE_CHAT_MESSAGE" ||
      event.type === "KICK_CHAT_MESSAGE"
    ) {
      const nickname = event.get("chatter_user_login");
      if (!state.voters.includes(nickname)) {
        state.voters.push(nickname);
      }
    }
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

  private clear() {
    this._state = {
      donaters: [],
      newFollowers: [],
      raiders: [],
      gifters: [],
      banned: [],
      voters: [],
      timestamp: -1,
    };
    this.save();
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
}
