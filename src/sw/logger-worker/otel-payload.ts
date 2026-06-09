import type { LogRecord, OtelResourceLogs } from "./logger-worker/types";

/**
 * Build an OTLP-compliant payload from a batch of log records.
 * This function is shared between the service worker and potentially
 * other parts of the project.
 */
export function buildOtelPayload(batch: LogRecord[]): OtelResourceLogs {
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
          return {
            timeUnixNano,
            severityText: rec.level || "INFO",
            body: { stringValue: rec.messages || "" },
            attributes: [],
          };
        }),
      },
    ],
  };

  return { resourceLogs: [resourceLogs] };
}
