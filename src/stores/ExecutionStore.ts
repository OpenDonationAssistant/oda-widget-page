import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class ExecutionStore {
  constructor(
    public fn: () => Promise<any> = () => Promise.resolve(),
    public callback: () => void = () => {},
    public hasError: boolean = false,
    public running: boolean = false,
    public acknowledged: boolean = true,
  ) {
    makeAutoObservable(this);
  }

  run() {
    this.hasError = false;
    this.running = true;
    this.acknowledged = false;
    this.fn()
      .then(() => {
        this.running = false;
      })
      .catch(() => {
        this.hasError = true;
        this.running = false;
      });
  }
}

export const ExecutionStoreContext = createContext<ExecutionStore>(
  new ExecutionStore(),
);
