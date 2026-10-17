import {
  deleteToken as deleteTokenRequest,
  getAccessToken,
  listTokens,
  setToken as setTokenRequest,
  toggleToken as toggleTokenRequest,
  type SetTokenSetTokenCommand,
  type TokenControllerTokenInfoDto,
} from "@opendonationassistant/recipient-service";
import { makeAutoObservable } from "mobx";
import { log } from "../logging";
import { uuidv7 } from "uuidv7";
import { createContext } from "react";

/** Endpoint used for token management (same as the previous factory default). */
const TOKEN_API_ENDPOINT = process.env.REACT_APP_AUTOMATION_API_ENDPOINT;

export interface Token {
  id: string;
  system: string;
  enabled: boolean;
  token: string;
  settings: any;
}

export interface TokenStore {
  tokens: Token[];
  addToken: (
    system: string,
    token: string,
    settings?: { [key: string]: object },
  ) => void;
  deleteToken: (tokenId: string) => void;
  updateToken: (token: Token) => void;
  toggleToken: (tokenId: string, enabled: boolean) => void;
}

export class DemoTokenStore implements TokenStore {
  tokens = [];
  addToken = (
    _system: string,
    _token: string,
    _settings?: { [key: string]: object },
  ) => {};
  deleteToken = () => {};
  updateToken = () => {};
  toggleToken = () => {};
}

export class DefaultTokenStore implements TokenStore {
  private _tokens: Token[] = [];
  private _token: string;

  constructor(token: string) {
    makeAutoObservable(this);
    this._token = token;
    this.load();
  }

  public load() {
    listTokens({
      baseURL: TOKEN_API_ENDPOINT,
      headers: { Authorization: `Bearer ${this._token}` },
      throwOnError: true,
    })
      .then((response) => this.enrich(response.data))
      .then((tokens) => {
        this._tokens = tokens;
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

  /**
   * Fetches the secret access token for each listed token. The list endpoint
   * only returns token metadata, so the secret must be requested explicitly.
   */
  private async enrich(infos: TokenControllerTokenInfoDto[]): Promise<Token[]> {
    return Promise.all(
      infos.map(async (info) => ({
        id: info.id,
        system: info.system,
        enabled: info.enabled,
        token: (
          await getAccessToken({
            body: { tokenId: info.id },
            baseURL: TOKEN_API_ENDPOINT,
            headers: { Authorization: `Bearer ${this._token}` },
            throwOnError: true,
          })
        ).data.token,
        settings: info.settings,
      })),
    );
  }

  public get tokens(): Token[] {
    return this._tokens;
  }

  public deleteToken(tokenId: string): void {
    deleteTokenRequest({
      body: { id: tokenId },
      baseURL: TOKEN_API_ENDPOINT,
      headers: { Authorization: `Bearer ${this._token}` },
      throwOnError: true,
    }).then(() => this.load());
  }

  public toggleToken(tokenId: string, enabled: boolean): void {
    toggleTokenRequest({
      body: { id: tokenId, enabled: enabled },
      baseURL: TOKEN_API_ENDPOINT,
      headers: { Authorization: `Bearer ${this._token}` },
      throwOnError: true,
    }).then(() => this.load());
  }

  public addToken(
    system: string,
    token: string,
    settings?: { [key: string]: object },
  ) {
    setTokenRequest({
      body: {
        id: uuidv7(),
        token: token,
        type: "accessToken",
        system: system,
        settings: (settings ?? {}) as SetTokenSetTokenCommand["settings"],
      },
      baseURL: TOKEN_API_ENDPOINT,
      headers: { Authorization: `Bearer ${this._token}` },
      throwOnError: true,
    }).then(() => this.load());
  }

  public updateToken(token: Token) {
    setTokenRequest({
      body: {
        id: token.id,
        token: token.token,
        type: "accessToken",
        system: token.system,
        settings: token.settings as SetTokenSetTokenCommand["settings"],
      },
      baseURL: TOKEN_API_ENDPOINT,
      headers: { Authorization: `Bearer ${this._token}` },
      throwOnError: true,
    }).then(() => this.load());
  }
}

export const TokenStoreContext = createContext<TokenStore | null>(null);
