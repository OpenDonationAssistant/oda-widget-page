/**
 * Service worker registration for the emote cache.
 *
 * Unlike the logger-worker (a SharedWorker), the emote cache runs as a
 * service worker so it can intercept network requests and store responses
 * in the Cache API. It caches emote images from the EmotesStore (7TV CDN)
 * with a cache-first strategy.
 */

import { onWorkerMessage } from "./worker";

const EMOTE_CACHE_WORKER_URL = `${process.env.PUBLIC_URL || ""}/emote-cache-worker.js`;

export function isEmoteCacheWorkerSupported(): boolean {
  return "serviceWorker" in navigator;
}

/** Register the emote cache service worker once the page has loaded. */
export function registerEmoteCacheWorker(): Promise<void> {
  if (!isEmoteCacheWorkerSupported()) return;
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
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: "CACHE_EMOTES", urls });
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
    if (!Array.isArray(message.urls)) return;
    const urls = message.urls.filter(
      (url): url is string => typeof url === "string",
    );
    cacheEmotes(urls);
  });
}
