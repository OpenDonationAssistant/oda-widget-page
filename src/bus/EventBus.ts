import { uuidv7 } from "uuidv7";
import { log } from "../logging";
import { Client } from "@stomp/stompjs";

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
  console.log(`${count} counted in ${STORE}`);

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

  public get(name: string): string | number | null {
    return this._variables.find((it) => it.name === name)?.value ?? null;
  }
}

export interface EventBus {
  push(event: Event): void;
}

export class DefaultEventBus implements EventBus {
  private _swScope: ServiceWorkerGlobalScope;
  private _socket = new Client({
    brokerURL: "ws://localhost/ws",
    // connectHeaders: {
    //   passcode: localStorage.getItem("access-token") ?? ""
    // },
    reconnectDelay: 500,
  });
  private _db: Promise<IDBDatabase>;

  constructor(recipientId: string, swScope: ServiceWorkerGlobalScope) {
    this._swScope = swScope;
    this._socket.onConnect = () => {
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
    this._db = openLogDB();
    this._socket.activate();
    this._swScope.addEventListener(
      "message",
      (event: ExtendableMessageEvent) => {
        const data = event.data as Record<string, unknown> | undefined;
        if (!data) return;
        if (data.type !== "REPLAY") return;

        event.waitUntil(
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

                if (cursor.value.timestamp >= data.timestamp) {
                  out.push(cursor.value);
                }
                cursor.continue();
              };
              req.onerror = () => reject(req.error);
            });

            // Send chunks if large; for simplicity send once
            const targetClient = event.source; // a specific window/tab (preferred if available)
            if (targetClient) {
              out.forEach((event) => targetClient.postMessage(event));
            }
          })(),
        );
      },
    );
    this._db.then((db) => setInterval(() => trimKeepLastN(db), 10000));
  }

  async sendMessage(msg: any) {
    const clients = await this._swScope.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    const db = await this._db;
    console.log({ msg: msg }, "Storing message");
    db.transaction(STORE, "readwrite")
      .objectStore(STORE)
      .put(msg);

    for (const client of clients) {
      client.postMessage(msg);
    }
  }

  private convert(body: string): Event {
    const json = JSON.parse(body);
    return new Event(json.type, json.variables);
  }

  public async push(event: Event) {
    log.debug({ message: event }, "EventBus message");
    await this.sendMessage(event);
  }
}
