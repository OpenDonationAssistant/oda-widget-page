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

/** Serialized emote response record for export/import. */
export interface EmoteResponseExport {
  key: string;
  items: unknown[];
  savedAt: number;
}

function isEmoteResponseItem(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.name === "string";
}

/**
 * Keep only records/items that match the persisted emote response shape.
 * Imported files are untrusted, so anything malformed is dropped here rather
 * than letting it corrupt the store or break the store's mapping logic.
 */
export function sanitizeEmoteResponses(
  records: unknown,
): EmoteResponseExport[] {
  if (!Array.isArray(records)) return [];
  const out: EmoteResponseExport[] = [];
  for (const record of records) {
    if (!record || typeof record !== "object") continue;
    const candidate = record as Record<string, unknown>;
    if (
      typeof candidate.key !== "string" ||
      typeof candidate.savedAt !== "number"
    ) {
      continue;
    }
    if (!Array.isArray(candidate.items)) continue;
    out.push({
      key: candidate.key,
      savedAt: candidate.savedAt,
      items: candidate.items.filter(isEmoteResponseItem),
    });
  }
  return out;
}

/** Read every persisted emote response record (for export). */
export async function exportEmoteResponses(): Promise<EmoteResponseExport[]> {
  if (!isIndexedDbAvailable()) return [];
  try {
    const db = await openDb();
    const records = await requestToPromise<CachedEmotes<unknown>[]>(
      db.transaction(STORE, "readonly").objectStore(STORE).getAll(),
    );
    return records.map(({ key, items, savedAt }) => ({ key, items, savedAt }));
  } catch (error) {
    log.warn({ error }, "Failed to export emote responses");
    return [];
  }
}

/** Restore previously exported emote response records (for import). */
export async function importEmoteResponses(
  records: EmoteResponseExport[],
): Promise<void> {
  if (!isIndexedDbAvailable() || records.length === 0) return;
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const record of records) {
      store.put(record);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (error) {
    log.warn({ error }, "Failed to import emote responses");
  }
}
