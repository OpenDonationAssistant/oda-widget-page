import { uuidv7 } from "uuidv7";
import { log } from "../logging";
import { Client } from "@stomp/stompjs";
import { reportError, reportStarted } from "../sw/logger-worker/worker-status";
import { deregister as deregisterDonationalerts } from "../sw/logger-worker/handlers/donationalerts-shim";
import { deregister as deregisterDonatepayEu } from "../sw/logger-worker/handlers/donatepay-eu-shim";
import { deregister as deregisterDonatepay } from "../sw/logger-worker/handlers/donatepay-shim";
import { deregister as deregisterDonatex } from "../sw/logger-worker/handlers/donatex-shim";
import { deregister as deregisterKickChat } from "../sw/logger-worker/handlers/kick-chat";
import { deregister as deregisterStreamelements } from "../sw/logger-worker/handlers/streamelements-shim";
import { deregister as deregisterTwitch } from "../sw/logger-worker/handlers/twitch-chat";
import { deregister as deregisterUnofficialDonationalerts } from "../sw/logger-worker/handlers/unofficial-donationalerts-shim";
import { deregister as deregisterVkLive } from "../sw/logger-worker/handlers/vklive-chat";
import type {
  MessageListenerRegistrar,
  WorkerMessageEvent,
} from "../sw/logger-worker/messaging";

const defaultTtl = (1000 * 60 * 60 * 24).toString(); // 24 hours

const DB_NAME = "events";
const DB_VERSION = 1;
const STORE = "event-log";
const RETAIN_LAST = 10000;

async function openLogDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "_timestamp" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function trimKeepLastN(db: IDBDatabase) {
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);

  // Count how many exist
  const count: number = await new Promise((resolve, reject) => {
    const cReq = store.count();
    cReq.onsuccess = () => resolve(cReq.result);
    cReq.onerror = () => reject(cReq.error);
  });

  const toDelete = count - RETAIN_LAST;
  if (toDelete <= 0) return;

  // Delete oldest `toDelete` records
  await new Promise((resolve, reject) => {
    const cursorReq = store.openCursor(null, "next"); // oldest -> newest
    let deleted = 0;

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (!cursor) return resolve(null);

      if (deleted < toDelete) {
        cursor.delete();
        deleted++;
        cursor.continue();
      } else {
        resolve(null);
      }
    };

    cursorReq.onerror = () => reject(cursorReq.error);
  });

  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(null);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export interface Emotes {
  type: string;
  name: string;
  id: string;
  gif: false;
  urls: any;
  start: 0;
  end: 0;
}

export interface Variable {
  id: string;
  name: string;
  value: any;
  type: string;
}

export class Event {
  private _type: string;
  private _variables: Variable[];
  private _timestamp: number;

  constructor(type: string, variables: Variable[], timestamp?: number) {
    this._type = type;
    this._variables = variables;
    this._timestamp = timestamp ?? Date.now();
  }

  public get type() {
    return this._type;
  }

  public get timestamp() {
    return this._timestamp;
  }

  public get(name: string): any {
    return this._variables.find((it) => it.name === name)?.value ?? null;
  }
}

export interface EventBus {
  push(event: Event): void;
}

export class DefaultEventBus implements EventBus {
  private _broadcast: (msg: unknown) => void;
  private _socket = new Client({
    brokerURL: process.env.REACT_APP_WS_ENDPOINT,
    // connectHeaders: {
    //   passcode: localStorage.getItem("access-token") ?? ""
    // },
    reconnectDelay: 500,
  });
  private _db: Promise<IDBDatabase>;

  constructor(
    token: string,
    recipientId: string,
    broadcast: (msg: unknown) => void,
    addMessageListener: MessageListenerRegistrar,
  ) {
    this._broadcast = broadcast;
    this._socket.onConnect = () => {
      reportStarted(token, "ODA");
      this._socket.subscribe(
        `/topic/${recipientId}.events`,
        (message) => {
          this.push(this.convert(message.body));
          message.ack();
        },
        {
          id: uuidv7(),
          durable: "false",
          "auto-delete": "false",
          ack: "client",
          "x-queue-name": uuidv7(),
          "x-message-ttl": defaultTtl,
          "x-expires": defaultTtl,
        },
      );
    };
    this._socket.onStompError = (frame) => {
      reportError(
        token,
        "ODA",
        `stomp error: ${frame.headers.message ?? "unknown"}`,
      );
    };
    this._socket.onWebSocketError = (evt) => {
      reportError(token, "ODA", `websocket error: ${evt}`);
    };
    this._socket.onWebSocketClose = (evt) => {
      reportError(token, "ODA", `websocket closed: ${evt.code} ${evt.reason}`);
    };
    this._db = openLogDB();
    this._socket.activate();
    addMessageListener((event: WorkerMessageEvent) => {
      const data = event.data as Record<string, unknown> | undefined;
      if (!data) return;
      if (data.type !== "REPLAY") return;

      (async () => {
        const db = await this._db;
        const tx = db.transaction(STORE, "readonly");
        const os = tx.objectStore(STORE);

        // Walk forward from fromSeq
        const out: Event[] = [];
        const req = os.openCursor();

        await new Promise((resolve, reject) => {
          req.onsuccess = () => {
            const cursor = req.result;
            if (!cursor) return resolve(null);

            if (cursor.value._timestamp >= Number(data.timestamp)) {
              out.push(cursor.value);
            }
            cursor.continue();
          };
          req.onerror = () => reject(req.error);
        });

        // Send chunks if large; for simplicity send once
        const targetPort = event.port; // the specific client that asked
        if (targetPort) {
          out.forEach((event) => targetPort.postMessage(event));
        }
      })();
    });
    this._db.then((db) => setInterval(() => trimKeepLastN(db), 10000));
  }

  async sendMessage(msg: any) {
    const db = await this._db;
    log.debug({ msg: msg }, "Storing message");
    db.transaction(STORE, "readwrite").objectStore(STORE).put(msg);

    this._broadcast(msg);
  }

  private convert(body: string): Event {
    const json = JSON.parse(body);
    return new Event(json.type, json.variables);
  }

  private async reloadServiceWorker() {
    deregisterDonationalerts();
    deregisterDonatepayEu();
    deregisterDonatepay();
    deregisterDonatex();
    deregisterKickChat();
    deregisterStreamelements();
    deregisterTwitch();
    deregisterUnofficialDonationalerts();
    deregisterVkLive();

    // SharedWorker has no `clients` API — ask every connected client to
    // reload itself instead of navigating windows from the worker.
    this._broadcast({ type: "RELOAD" });
  }

  public async push(event: Event) {
    log.debug({ message: event }, "EventBus message");
    await this.sendMessage(event);
    const tokenType = event.get("tokenType");
    const eventName = event.get("event");
    if (
      event.type === "AuthUpdated" &&
      !(tokenType === "refreshToken" && eventName === "TOKEN_UPDATED")
    ) {
      // await this.reloadServiceWorker();
    }
  }
}
