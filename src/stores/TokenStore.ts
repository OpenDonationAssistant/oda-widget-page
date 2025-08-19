import { DefaultApiFactory } from "@opendonationassistant/oda-recipient-service-client";
import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { uuidv7 } from "uuidv7";

export interface Token {
  id: string;
  system: string;
  enabled: boolean;
  token: string;
}

export interface TokenStore {
  tokens: Token[];
  deleteToken: (tokenId: string) => void;
  toggleToken: (tokenId: string, enabled: boolean) => void;
}

export class DemoTokenStore{
  tokens: Token[] = [];
  deleteToken: (tokenId: string) => void = () => {};
  toggleToken: (tokenId: string, enabled: boolean) => void = () => {};
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
            token: token.token
          };
        });
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
      })
      .then(() => this.load());
  }
}
