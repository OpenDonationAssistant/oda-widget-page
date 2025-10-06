import React from "react";

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

export class DefaultGamesStore implements GamesStore {
  public get all() {
    return [
      {
        id: "rimworld",
        name: "Rimworld",
      },
      {
        id: "factorio",
        name: "Factorio",
      },
    ];
  }
  public get added() {
    return [
      {
        id: "factorio",
        name: "Factorio",
        enabled: true,
      },
    ];
  }
}

export const GamesStoreContext = React.createContext<GamesStore>(
  new DefaultGamesStore(),
);
