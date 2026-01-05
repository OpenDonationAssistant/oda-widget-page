import { makeAutoObservable } from "mobx";
import React from "react";

type ElementState = "start" | "main" | "end" | "waiting";

export class StateMachine {
  private _currentState: ElementState = "waiting";
  private _targetState: ElementState = "waiting";
  private _componentStates: { [key: string]: boolean } = {};

  constructor(){
    makeAutoObservable(this);
  }

  public registerComponent(componentId: string) {
    this._componentStates[componentId] = false;
  }

  public setComponentState(componentId: string, state: boolean) {
    this._componentStates[componentId] = state;
    if (this._targetState === null) {
      return;
    }
    const hasUncompleted = Object.keys(this._componentStates)
      .find((key) => !this._componentStates[key]) !== undefined;
    this._currentState = hasUncompleted ? this._currentState : this._targetState;
  }

  private resetComponentStates() {
    Object.keys(this._componentStates).forEach((key) => {
      this._componentStates[key] = false;
    });
  }

  public get state() {
    return this._currentState;
  }

  public goTo(state: ElementState) {
    this.resetComponentStates();
    this._targetState = state;
  }
}

export const StateMachineContext = React.createContext(new StateMachine());
