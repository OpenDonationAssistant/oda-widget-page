import {
  Amount,
  HistoryItemData,
  HistoryItemDataActionRequest,
  HistoryItemDataAttachment,
  HistoryItemDataReelResult,
  HistoryItemDataTargetGoal,
  downloadCsv,
  getCsvStatus,
  getHistory,
  printCsv,
  repeatAlert,
} from "@opendonationassistant/history-service";
import { log } from "../../logging";

export interface HistoryItem {
  id: string;
  originId: string;
  amount: Amount;
  nickname: string;
  system: string;
  event: string;
  count: number;
  levelName: string;
  goals: HistoryItemDataTargetGoal[];
  rouletteResults: HistoryItemDataReelResult[];
  message: string;
  attachments: HistoryItemDataAttachment[];
  actions: HistoryItemDataActionRequest[];
  timestamp: Date;
  date: string;
  time: string;
  active: boolean;
  lastModified: string;
}

export interface HistoryStore {
  get(count: number): Promise<void>;
  isLoading: boolean;
  export(): Promise<void>;
}

export class DefaultHistoryStore {
  constructor(
    private _token: string,
    private _pageSize = 20,
  ) {}
}

const DB_NAME = "history-items-cache";
const DB_VERSION = 1;
const ITEMS_STORE_NAME = "items";
const INDEX_NAME = "byRecipient";

let dbPromise: Promise<IDBDatabase | null> | null = null;
function openDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        const items = db.createObjectStore(ITEMS_STORE_NAME, { keyPath: "id" });
        items.createIndex(INDEX_NAME, ["recipientId"]);
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        log.error(request.error, "failed to open history cache");
        resolve(null);
      };
      request.onblocked = () => resolve(null);
    });
  }
  return dbPromise;
}
