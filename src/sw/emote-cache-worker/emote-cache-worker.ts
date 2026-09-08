/// <reference lib="webworker" />

/**
 * Emote cache service worker.
 *
 * Caches emote images served from the emote CDNs used by EmotesStore
 * (currently 7TV) with a cache-first strategy, so widgets render emotes
 * instantly on repeat visits and survive flaky connections.
 *
 * The worker is a service worker (not a SharedWorker like the logger-worker)
 * because it must intercept network requests and use the Cache API. It is
 * built by scripts/build-emote-cache-worker.mjs into public/emote-cache-worker.js
 * and registered from src/emoteCacheWorker.ts.
 */

const EMOTE_CACHE_NAME = "emote-cache-v1";
const EMOTE_CACHE_PREFIX = "emote-cache-";
const MAX_CACHE_ENTRIES = 5000;

/** Hosts that serve emote images. Extend when new emote providers are added. */
const EMOTE_CDN_HOSTS = new Set(["cdn.7tv.app"]);

/** One cached emote serialized for export/import. */
interface EmoteCacheEntry {
  url: string;
  contentType: string;
  /** Image body as base64. */
  data: string;
}

const swScope = self as unknown as ServiceWorkerGlobalScope;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function isEmoteCacheEntry(value: unknown): value is EmoteCacheEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.url === "string" &&
    typeof entry.contentType === "string" &&
    typeof entry.data === "string"
  );
}

/** True when the request targets an emote CDN. */
function isEmoteUrl(url: URL): boolean {
  return EMOTE_CDN_HOSTS.has(url.hostname);
}

/** Opaque responses (cross-origin <img> loads) have status 0 but are cacheable. */
function isCacheableResponse(response: Response): boolean {
  return response.ok || response.type === "opaque";
}

/** Keep the cache bounded by evicting the oldest entries. */
async function trimCache(cache: Cache): Promise<void> {
  const keys = await cache.keys();
  if (keys.length <= MAX_CACHE_ENTRIES) return;
  const overflow = keys.length - MAX_CACHE_ENTRIES;
  await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
}

async function cacheEmote(url: string, response: Response): Promise<void> {
  const cache = await caches.open(EMOTE_CACHE_NAME);
  await cache.put(url, response);
  await trimCache(cache);
}

/** Cache-first strategy: serve from cache, fall back to the network. */
async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(EMOTE_CACHE_NAME);
  const cached = await cache.match(request.url);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    // Cache a clone; the original is returned to the caller.
    await cacheEmote(request.url, response.clone());
  }
  return response;
}

/** Remove caches from previous versions of this worker. */
async function cleanupOldCaches(): Promise<void> {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter(
        (key) => key.startsWith(EMOTE_CACHE_PREFIX) && key !== EMOTE_CACHE_NAME,
      )
      .map((key) => caches.delete(key)),
  );
}

/** Pre-cache a list of emote URLs (warm-up from EmotesStore). */
async function cacheUrls(urls: string[]): Promise<void> {
  const cache = await caches.open(EMOTE_CACHE_NAME);
  await Promise.all(
    urls.map(async (url) => {
      if (await cache.match(url)) {
        console.log({ url }, "Emote already cached");
        return;
      }
      try {
        const response = await fetch(url);
        if (isCacheableResponse(response)) {
          console.log({ url }, "Pre-caching emote");
          await cache.put(url, response);
        }
      } catch {
        // Ignore individual failures; the fetch handler will retry later.
      }
    }),
  );
  await trimCache(cache);
}

/** Serialize every readable cache entry for export. Opaque responses are skipped. */
async function exportCache(): Promise<{ entries: EmoteCacheEntry[] }> {
  const cache = await caches.open(EMOTE_CACHE_NAME);
  const keys = await cache.keys();
  const entries: EmoteCacheEntry[] = [];
  for (const request of keys) {
    const response = await cache.match(request);
    if (!response) continue;
    try {
      const buffer = await response.arrayBuffer();
      entries.push({
        url: request.url,
        contentType: response.headers.get("content-type") ?? "image/webp",
        data: arrayBufferToBase64(buffer),
      });
    } catch {
      // Opaque responses have unreadable bodies; skip them.
    }
  }
  return { entries };
}

/** Restore previously exported entries into the cache. */
async function importCache(entries: EmoteCacheEntry[]): Promise<void> {
  const cache = await caches.open(EMOTE_CACHE_NAME);
  await Promise.all(
    entries.map(async (entry) => {
      try {
        const response = new Response(base64ToArrayBuffer(entry.data), {
          headers: { "Content-Type": entry.contentType },
        });
        await cache.put(entry.url, response);
      } catch {
        // Ignore individual failures; the fetch handler will retry later.
      }
    }),
  );
  await trimCache(cache);
}

swScope.addEventListener("install", (event) => {
  event.waitUntil(swScope.skipWaiting());
});

swScope.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // await cleanupOldCaches();
      await swScope.clients.claim();
    })(),
  );
});

swScope.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!isEmoteUrl(url)) return;
  event.respondWith(cacheFirst(request));
});

swScope.addEventListener("message", (event) => {
  const data = event.data as
    | { type?: string; urls?: unknown; entries?: unknown }
    | undefined;
  if (!data) return;

  if (data.type === "CACHE_EMOTES" && Array.isArray(data.urls)) {
  // if (data.type === "CACHE_EMOTES" && Array.isArray(data.urls)) {
    console.log({ urls: data.urls }, "Start to caching urls");
    const urls = data.urls.filter(
      (url): url is string => typeof url === "string",
    );
    event.waitUntil(cacheUrls(urls));
    return;
  }

  if (data.type === "EXPORT_CACHE") {
    event.waitUntil(
      exportCache().then((result) => {
        event.source?.postMessage({ type: "EXPORT_CACHE_RESULT", ...result });
      }),
    );
    return;
  }

  if (data.type === "IMPORT_CACHE" && Array.isArray(data.entries)) {
    const entries = data.entries.filter(isEmoteCacheEntry);
    event.waitUntil(importCache(entries));
  }
});
