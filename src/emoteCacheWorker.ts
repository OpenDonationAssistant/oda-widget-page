/**
 * Service worker registration for the emote cache.
 *
 * Unlike the logger-worker (a SharedWorker), the emote cache runs as a
 * service worker so it can intercept network requests and store responses
 * in the Cache API. It caches emote images from the EmotesStore (7TV CDN)
 * with a cache-first strategy.
 */

import { onWorkerMessage } from "./worker";
import {
  EmoteResponseExport,
  exportEmoteResponses,
  importEmoteResponses,
  sanitizeEmoteResponses,
} from "./stores/emoteCache";

const EMOTE_CACHE_WORKER_URL = `${process.env.PUBLIC_URL || ""}/emote-cache-worker.js`;

/** One cached emote serialized for export/import. */
export interface EmoteCacheEntry {
  url: string;
  contentType: string;
  /** Image body as base64. */
  data: string;
}

/** Shape of the exported emote cache file. */
export interface EmoteCacheExport {
  entries: EmoteCacheEntry[];
  /** Persisted emote response lists (the emote list table). */
  emotes: EmoteResponseExport[];
}

export function isEmoteCacheWorkerSupported(): boolean {
  return "serviceWorker" in navigator;
}

/** Register the emote cache service worker once the page has loaded. */
export function registerEmoteCacheWorker(): Promise<void> {
  if (!isEmoteCacheWorkerSupported()) return Promise.resolve();
  console.log("Registering emote cache worker");
  return navigator.serviceWorker
    .register(EMOTE_CACHE_WORKER_URL)
    .then((registration) => {
      console.log("Registered emote cache worker", registration);
    })
    .catch((error) => {
      console.error("Failed to register emote cache worker", error);
    });
}

/**
 * Ask the service worker to pre-cache the given emote URLs. No-op when
 * service workers are unsupported or the list is empty.
 */
export async function cacheEmotes(urls: string[]): Promise<void> {
  if (!isEmoteCacheWorkerSupported() || urls.length === 0) return;
  try {
    console.log("Caching emotes", urls);
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: "CACHE_EMOTES", urls });
    console.log("CACHE_EMOTES sent", urls);
  } catch (error) {
    console.error("Failed to send emotes to cache worker", error);
  }
}

/**
 * Forward emote URLs loaded by the logger-worker (SharedWorker) to the
 * emote cache service worker so they are cached before first render.
 */
export function forwardEmotesToCache(): void {
  if (!isEmoteCacheWorkerSupported()) return;
  onWorkerMessage((data) => {
    const message = data as { type?: string; urls?: unknown } | undefined;
    if (!message || message.type !== "EMOTES_LOADED") return;
    console.log({ message }, "Forwarding emotes to cache worker");
    if (!Array.isArray(message.urls)) return;
    const urls = message.urls.filter(
      (url): url is string => typeof url === "string",
    );
    cacheEmotes(urls);
  });
}

/**
 * Ask the service worker to serialize the emote cache and resolve with the
 * result. Returns null when service workers are unsupported or no active
 * worker is available.
 */
export async function exportEmoteCache(): Promise<EmoteCacheExport | null> {
  if (!isEmoteCacheWorkerSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  const controller = registration.active;
  if (!controller) return null;

  const result = await new Promise<EmoteCacheExport>((resolve, reject) => {
    const timeout = setTimeout(() => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      reject(new Error("Timed out waiting for emote cache export"));
    }, 30000);

    const onMessage = (event: MessageEvent) => {
      const data = event.data as
        | { type?: string; entries?: unknown }
        | undefined;
      if (!data || data.type !== "EXPORT_CACHE_RESULT") return;
      clearTimeout(timeout);
      navigator.serviceWorker.removeEventListener("message", onMessage);
      resolve(data as EmoteCacheExport);
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    controller.postMessage({ type: "EXPORT_CACHE" });
  });

  const emotes = await exportEmoteResponses();
  return { entries: result.entries, emotes };
}

/**
 * Ask the service worker to restore previously exported entries into the
 * emote cache and write the exported emote response lists back to the
 * IndexedDB table. No-op when the payload is empty.
 */
export async function importEmoteCache(
  data: EmoteCacheExport,
): Promise<void> {
  const entries = Array.isArray(data.entries) ? data.entries : [];
  if (isEmoteCacheWorkerSupported() && entries.length > 0) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: "IMPORT_CACHE", entries });
    } catch (error) {
      console.error("Failed to send emotes to cache worker", error);
    }
  }

  await importEmoteResponses(sanitizeEmoteResponses(data.emotes));
}
