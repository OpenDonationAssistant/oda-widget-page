import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export interface ErrorInfo {
  message: string;
  details?: string;
}

export class ErrorStore {
  private _error: ErrorInfo | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get error() {
    return this._error;
  }

  public setError(message: string, details?: string) {
    this._error = { message, details };
  }

  public clearError() {
    this._error = null;
  }
}

export const ErrorStoreContext = createContext<ErrorStore>(new ErrorStore());

export let globalErrorStore: ErrorStore;

export const initGlobalErrorStore = (store: ErrorStore) => {
  globalErrorStore = store;
};
