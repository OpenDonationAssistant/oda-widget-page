/**
 * Persistent response cache for emote lookups.
 *
 * Emote responses are fetched from external APIs (7TV) that can fail when the
 * network is down. Persisting the last successful response lets the store fall
 * back to it instead of rendering zero emotes.
 *
 * Backed by raw IndexedDB (same approach as `src/bus/EventBus.ts`) so it works
 * unchanged in the main thread and in the logger SharedWorker, and adds no
 * dependency. The cache is generic so it stays decoupled from the 7TV response
 * shape and can be swapped for an in-memory fake in tests.
 */

import { log } from "../logging";

const DB_NAME = "emote-responses";
const DB_VERSION = 1;
const STORE = "responses";

interface CachedEmotes<T> {
  key: string;
  items: T[];
  savedAt: number;
}

export interface EmoteResponseCache<T> {
  /** Returns the last saved items for `key`, or undefined when none exist. */
  read(key: string): Promise<T[] | undefined>;
  /** Persists `items` for `key`, replacing any previous entry. */
  write(key: string, items: T[]): Promise<void>;
}

function isIndexedDbAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export class IndexedDbEmoteCache<T> implements EmoteResponseCache<T> {
  private _db?: Promise<IDBDatabase>;

  private db(): Promise<IDBDatabase> {
    this._db ??= openDb();
    return this._db;
  }

  public async read(key: string): Promise<T[] | undefined> {
    if (!isIndexedDbAvailable()) return undefined;
    try {
      const db = await this.db();
      const record = await requestToPromise<CachedEmotes<T> | undefined>(
        db.transaction(STORE, "readonly").objectStore(STORE).get(key),
      );
      return record?.items;
    } catch (error) {
      log.warn({ error, key }, "Failed to read cached emote response");
      return undefined;
    }
  }

  public async write(key: string, items: T[]): Promise<void> {
    if (!isIndexedDbAvailable()) return;
    try {
      const db = await this.db();
      const record: CachedEmotes<T> = { key, items, savedAt: Date.now() };
      await requestToPromise(
        db.transaction(STORE, "readwrite").objectStore(STORE).put(record),
      );
    } catch (error) {
      log.warn({ error, key }, "Failed to persist emote response");
    }
  }
}
