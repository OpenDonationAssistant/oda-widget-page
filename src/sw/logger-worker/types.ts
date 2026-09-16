import type { Feature } from "../../shared/features";
import type { WorkerStatusMessage } from "./worker-status";

/** Messages the main thread sends to the service worker. */
export interface LogRecord {
  level: string;
  messages: string;
  ts: number;
}

export interface UserAuthorizedPayload {
  recipientId: string;
  features: Feature[];
}

export type WorkerIncomingMessage =
  | { type: "LOG"; log: LogRecord }
  | { type: "USER_AUTHORIZED"; recipientId: string; features: Feature[] };

export type WorkerProgressStage =
  | "starting"
  | "eventbus"
  | "emotes"
  | "handlers"
  | "ready";

export interface WorkerProgressMessage {
  type: "WORKER_PROGRESS";
  stage: WorkerProgressStage;
  percent: number;
  label: string;
}

export interface WorkerStatusChangedMessage {
  type: "WORKER_STATUS_CHANGED";
  status: WorkerStatusMessage;
}

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
