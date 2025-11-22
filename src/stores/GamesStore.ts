import React from "react";
import { TokenStore } from "./TokenStore";

export interface GameDescription {
  id: string;
  name: string;
}

export interface GameIntegration {
  id: string;
  name: string;
  enabled: boolean;
}

export interface GamesStore {
  all: GameDescription[];
  added: GameIntegration[];
}

export class DemoGamesStore implements GamesStore {
  public get all() {
    return [];
  }
  public get added() {
    return [];
  }
}

export class DefaultGamesStore implements GamesStore {
  private _tokenStore: TokenStore;

  constructor(tokenStore: TokenStore) {
    this._tokenStore = tokenStore;
  }

  public get all() {
    return [
      {
        id: "DonationListener",
        name: "DonationListener",
      },
    ];
  }

  public get added() {
    return [];
  }
}

export const GamesStoreContext = React.createContext<GamesStore>(
  new DemoGamesStore(),
);
