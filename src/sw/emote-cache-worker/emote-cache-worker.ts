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

const swScope = self as unknown as ServiceWorkerGlobalScope;

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
      if (await cache.match(url)) return;
      try {
        const response = await fetch(url);
        if (isCacheableResponse(response)) {
          await cache.put(url, response);
        }
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
      await cleanupOldCaches();
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
  const data = event.data as { type?: string; urls?: unknown } | undefined;
  if (!data || data.type !== "CACHE_EMOTES" || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter((url): url is string => typeof url === "string");
  event.waitUntil(cacheUrls(urls));
});
