import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class WordBlacklistStore {
  private _words: string[] = [];

  constructor() {
    makeAutoObservable(this);
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

  public load(): Promise<void> {
    // TODO: implement loading
    return Promise.resolve();
  }

  public save(): Promise<void> {
    // TODO: implement saving
    return Promise.resolve();
  }

  public get words(): string[] {
    return this._words;
  }
}

export const WordBlacklistStoreContext =
  createContext<WordBlacklistStore | null>(null);
