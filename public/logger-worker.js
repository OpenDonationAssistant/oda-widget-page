const OTEL_ENDPOINT = "https://api.oda.digital/logs";
const BATCH_TIMEOUT_MS = 2000;

let queue = [];
let recipientId = "unknown";
let features = [];

function makePayload(batch) {
  const resourceLogs = {
    resource: {
      attributes: [
        { key: "service.name", value: { stringValue: "my-web-app" } },
      ],
    },
    scopeLogs: [
      {
        scope: { name: "browser-logger", version: "1.0.0" },
        logRecords: batch.map((rec) => {
          const ts = typeof rec.ts === "number" ? rec.ts : Date.now();
          // OTLP proto timestamps are in nanoseconds since epoch
          const timeUnixNano = String(BigInt(ts) * 1000000n);
          const attrs = [];
          if (rec.level) {
            attrs.push({ key: "log.level", value: { stringValue: rec.level } });
          }
          return {
            timeUnixNano,
            severityText: rec.level.label || "INFO",
            body: { stringValue: rec.messages || "" },
            attributes: [],
          };
        }),
      },
    ],
  };

  return { resourceLogs: [resourceLogs] };
}

const MAX_BATCH_SIZE = 10;

async function flushQueue() {
  const batchSize = Math.min(queue.length, MAX_BATCH_SIZE);
  const batch = queue.splice(0, batchSize);
  if (batch.length === 0) {
    return;
  }
  return fetch(OTEL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(makePayload(batch)),
    keepalive: true,
  });
}

setInterval(flushQueue, BATCH_TIMEOUT_MS);

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("message", (e) => {
  const { data } = e;
  if (data.recipientId) {
    recipientId = data.recipientId;
  }
  if (data.features) {
    features = data.features;
  }
  if (data.log) {
    queue.push(data.log);
  }
});
