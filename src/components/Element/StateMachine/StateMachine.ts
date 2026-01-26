import { makeAutoObservable } from "mobx";
import React from "react";

type ElementState = "visible" | "hidden";

export class StateMachine {
  private _state: ElementState = "hidden";
  private _callbacks: ((target: ElementState) => Promise<void>)[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addCallback(target: ElementState, callback: () => Promise<any>) {
    this._callbacks.push((state: ElementState) => {
      if (state !== target) {
        return Promise.resolve();
      }
      return callback();
    });
  }

  public get state() {
    return this._state;
  }

  public goTo(state: ElementState) {
    return Promise.all(this._callbacks.map((callback) => callback(state))).then(
      () => (this._state = state),
    );
  }
}

export const StateMachineContext = React.createContext(new StateMachine());
