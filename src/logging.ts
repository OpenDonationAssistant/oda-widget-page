import pino from "pino";

function valueOf(level: string): number {
  switch (level.toLowerCase()) {
    case "error":
      return 0;
    case "warn":
      return 1;
    case "info":
      return 2;
    case "debug":
      return 3;
    default:
      return 0;
  }
}

const send = async function (level: string, logEvent: any) {
  if (!logEvent?.level?.label) {
    return;
  }
  console.log({ logEvent });
  const module = logEvent.bindings.at(-1)?.module;
  const loglevel = module
    ? (loglevels.find((l) => l.name === module)?.level.toLowerCase() ?? "error")
    : "error";
  if (valueOf(level) > valueOf(loglevel)) {
    return;
  }
  navigator.serviceWorker?.ready.then((worker) => {
    try {
      worker.active?.postMessage({
        type: "LOG",
        log: {
          level: logEvent.level.label.toUpperCase(),
          messages: logEvent.messages
            .map((m: any) => JSON.stringify(m))
            .join(";"),
          ts: logEvent.ts,
        },
      });
    } catch (e) {
      console.error({ logEvent }, `Error while transmitting log`);
    }
  });
};

interface LogLevel {
  name: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "DISABLED";
}

let loglevels: LogLevel[] = [];

function setLoglevel(levels: LogLevel[]) {
  loglevels = levels;
}

const log = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      send,
    },
  },
});
log.level = process.env.REACT_APP_PINO_LOG_LEVEL || "debug";

export { log, setLoglevel };
