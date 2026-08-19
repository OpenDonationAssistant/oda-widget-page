import { makeAutoObservable } from "mobx";

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

  constructor() {
    makeAutoObservable(this);
    if (!navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker.addEventListener("message", this.onMessage);
    this.refresh();
    this.timer = window.setInterval(() => this.refresh(), 5000);
  }

  private onMessage = (event: MessageEvent) => {
    const data = event.data as
      | { type?: string; statuses?: Map<string, WorkerStatusMessage> }
      | undefined;
    if (!data || data.type !== "WorkersStatus" || !data.statuses) {
      return;
    }
    this._connected = getConnectedServices(data.statuses);
    this._errors = getErrors(data.statuses);
  };

  public refresh() {
    if (!navigator.serviceWorker) {
      return;
    }
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "GetWorkersStatus",
      });
    } else {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: "GetWorkersStatus" });
      });
    }
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
    navigator.serviceWorker?.removeEventListener("message", this.onMessage);
  }
}
