/** Messages the main thread sends to the service worker. */
export interface LogRecord {
  level: string;
  messages: string;
  ts: number;
}

export interface UserAuthorizedPayload {
  recipientId: string;
  features: { name: string; state: string }[];
}

export type WorkerIncomingMessage =
  | { type: "LOG"; log: LogRecord }
  | { type: "USER_AUTHORIZED"; recipientId: string; features: { name: string; state: string }[] };

/** OTEL-compliant log attribute. */
export interface OtelAttribute {
  key: string;
  value: { stringValue: string };
}

/** A single OTLP log record. */
export interface OtelLogRecord {
  timeUnixNano: string;
  severityText: string;
  body: { stringValue: string };
  attributes: OtelAttribute[];
}

/** OTLP resource log envelope. */
export interface OtelResourceLogs {
  resourceLogs: {
    resource: {
      attributes: OtelAttribute[];
    };
    scopeLogs: {
      scope: { name: string; version: string };
      logRecords: OtelLogRecord[];
    }[];
  }[];
}
