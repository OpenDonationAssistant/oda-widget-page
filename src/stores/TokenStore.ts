import { DefaultApiFactory } from "@opendonationassistant/oda-recipient-service-client";
import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { uuidv7 } from "uuidv7";
import { createContext } from "react";

export interface Token {
  id: string;
  system: string;
  enabled: boolean;
  token: string;
  settings: any;
}

export interface TokenStore {
  tokens: Token[];
  addToken: (system: string, token: string) => void;
  deleteToken: (tokenId: string) => void;
  updateToken: (token: Token) => void;
  toggleToken: (tokenId: string, enabled: boolean) => void;
}

export class DemoTokenStore implements TokenStore {
  tokens = [];
  addToken = () => {};
  deleteToken = () => {};
  updateToken = () => {};
  toggleToken = () => {};
}

export class DefaultTokenStore implements TokenStore {
  private _tokens: Token[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
    );
  }

  public load() {
    this.client()
      .listTokens({})
      .then((response) => {
        this._tokens = response.data.map((token) => {
          return {
            id: token.id,
            system: token.system,
            enabled: token.enabled,
            token: token.token,
            settings: token.settings,
          };
        });
        log.debug(
          {
            tokens: this._tokens.map((token) => {
              return { id: token.id, settings: token.settings };
            }),
          },
          "loaded tokens",
        );
      })
      .catch((error) => {
        log.error("Failed to load tokens", error);
      });
  }

  public get tokens(): Token[] {
    return this._tokens;
  }

  public deleteToken(tokenId: string): void {
    this.client()
      .deleteToken({ id: tokenId })
      .then(() => this.load());
  }

  public toggleToken(tokenId: string, enabled: boolean): void {
    this.client()
      .toggleToken({ id: tokenId, enabled: enabled })
      .then(() => this.load());
  }

  public addToken(system: string, token: string) {
    this.client()
      .setToken({
        id: uuidv7(),
        token: token,
        type: "accessToken",
        system: system,
        settings: {},
      })
      .then(() => this.load());
  }

  public updateToken(token: Token) {
    this.client()
      .setToken({
        id: token.id,
        token: token.token,
        type: "accessToken",
        system: token.system,
        settings: token.settings,
      })
      .then(() => this.load());
  }
}

export const TokenStoreContext = createContext<TokenStore | null>(null);
