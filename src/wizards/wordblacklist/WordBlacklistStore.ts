import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import {
  getBlacklist,
  updateBlacklist,
} from "@opendonationassistant/automation-service";
import { ObjectWrapper } from "../../utils";
import { useAuth } from "../../contexts/AuthContext";
import { log } from "../../logging";

export class WordBlacklistStore {
  private _words: string[] = [];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    makeAutoObservable(this);
    this.load();
  }

  public load(): Promise<void> {
    return getBlacklist({
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    }).then((response) => {
      if (response.error) {
        log.error(response.error, "failed to load word blacklist");
        return;
      }
      this._words = (response.data ?? []).flatMap((entry) => entry.words);
    });
  }

  public save(): Promise<void> {
    return updateBlacklist({
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: this._words,
    }).then((response) => {
      if (response.error) {
        log.error(response.error, "failed to save word blacklist");
        return;
      }
    });
  }

  public addWord(word: string): void {
    const trimmed = word.trim();
    if (trimmed && !this._words.includes(trimmed)) {
      this._words.push(trimmed);
    }
  }

  public removeWord(word: string): void {
    this._words = this._words.filter((w) => w !== word);
  }

  public get words(): string[] {
    return this._words;
  }
}

export const WordBlacklistStoreContext = createContext<
  ObjectWrapper<WordBlacklistStore>
>(new ObjectWrapper<WordBlacklistStore>(null));

export function useWordBlacklistStore() {
  const { accessToken } = useAuth();
  const context = useContext(WordBlacklistStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error(
        "useWordBlacklistStore must be used within an AuthProvider",
      );
    }
    context.value = new WordBlacklistStore(accessToken);
  }
  return { store: context.value };
}

