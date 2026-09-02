import { makeAutoObservable } from "mobx";
import { sendMessageToWorker } from "../worker";
import { onWorkerMessage } from "../worker";

export interface WorkerStatusMessage {
  type: "HandlerStarted" | "HandlerError";
  handler: string;
  message?: string;
  timestamp: number;
}

export interface WorkersStore {
  connected: string[];
  errors: WorkerStatusMessage[];
  refresh: () => void;
  remove: (handler: string) => void;
  dispose: () => void;
}

export const getConnectedServices = (
  statuses: Map<string, WorkerStatusMessage>,
): string[] =>
  Array.from(statuses.values())
    .filter((status) => status.type === "HandlerStarted")
    .map((status) => status.handler);

export const getErrors = (
  statuses: Map<string, WorkerStatusMessage>,
): WorkerStatusMessage[] =>
  Array.from(statuses.values()).filter(
    (status) => status.type === "HandlerError",
  );

export class DefaultWorkersStore {
  private _connected: string[] = [];
  private _errors: WorkerStatusMessage[] = [];
  private timer?: number;
  private unsubscribe?: () => void;

  constructor() {
    makeAutoObservable(this);
    this.unsubscribe = onWorkerMessage(this.onMessage);
    this.refresh();
    this.timer = window.setInterval(() => this.refresh(), 5000);
  }

  private onMessage = (data: any) => {
    if (!data || data.type !== "WorkersStatus" || !data.statuses) {
      return;
    }
    this._connected = getConnectedServices(data.statuses);
    this._errors = getErrors(data.statuses);
  };

  public refresh() {
    sendMessageToWorker({ type: "GetWorkersStatus" });
  }

  public remove(handler: string) {
    this._connected = this._connected.filter((name) => name !== handler);
    this._errors = this._errors.filter((error) => error.handler !== handler);
    sendMessageToWorker({ type: "RemoveWorkersStatus", handler });
  }

  public get connected() {
    return this._connected;
  }

  public get errors() {
    return this._errors;
  }

  public dispose() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
    this.unsubscribe?.();
  }
}
