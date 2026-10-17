import { Client, StompSubscription, messageCallbackType } from "@stomp/stompjs";
import { log } from "./logging";
import { tokenRequest, Tokens } from "./pages/Login/Login";

export interface ListenerOptions {
  durable?: string;
  autoDelete?: string;
  ack?: string;
  ttl?: number;
}

interface Listener {
  id: string;
  topic: string;
  onMessage: messageCallbackType;
  options: ListenerOptions;
}

const socket = new Client({
  brokerURL: process.env.REACT_APP_WS_ENDPOINT,
  reconnectDelay: 500,
});

const subscriptions = new Map<string, StompSubscription>();
let refreshInFlight: Promise<Tokens> | undefined;

function refreshTokens(refreshToken: string): Promise<Tokens> {
  if (!refreshInFlight) {
    refreshInFlight = tokenRequest({ refreshToken }).finally(() => {
      refreshInFlight = undefined;
    });
  }
  return refreshInFlight;
}

socket.beforeConnect = async () => {
  const refreshToken = localStorage.getItem("refresh-token");
  if (!refreshToken) {
    return;
  }
  try {
    const tokens = await refreshTokens(refreshToken);
    socket.connectHeaders = { passcode: tokens.accessToken };
  } catch (error) {
    log.error({ error: error }, "Failed to refresh access token for websocket");
  }
};

socket.onStompError = (frame) => {
  log.error(
    { message: frame.headers.message, body: frame.body },
    "STOMP error received",
  );
};

socket.onWebSocketClose = () => {
  subscriptions.clear();
};

socket.onDisconnect = () => {
  subscriptions.clear();
};

var listeners: Listener[] = [];
socket.activate();

function subscriptionId(listener: Listener) {
  return `${listener.topic}-${listener.id}`;
}

function createDispatcher(listener: Listener): messageCallbackType {
  return (message) => listener.onMessage(message);
}

function createOptions(listener: Listener) {
  const defaultTtl = (1000 * 60 * 60 * 24).toString(); // 24 hours
  const id = subscriptionId(listener);
  return {
    id: id,
    durable: listener.options.durable ?? "true",
    "auto-delete": listener.options.autoDelete ?? "false",
    ack: listener.options.ack ?? "client",
    "x-queue-name": id,
    "x-message-ttl": listener.options.ttl?.toString() ?? defaultTtl,
    "x-expires": listener.options.ttl?.toString() ?? defaultTtl,
  };
}

socket.onConnect = () => {
  listeners.forEach((listener) => {
    const id = subscriptionId(listener);
    if (subscriptions.has(id)) {
      return;
    }
    subscriptions.set(
      id,
      socket.subscribe(
        listener.topic,
        createDispatcher(listener),
        createOptions(listener),
      ),
    );
  });
};

function subscribe(
  id: string,
  topic: string,
  onMessage: messageCallbackType,
  options?: ListenerOptions,
) {
  const existingListener = listeners.find(
    (listener) => listener.id === id && listener.topic === topic,
  );
  if (existingListener) {
    existingListener.onMessage = onMessage;
    if (options) {
      existingListener.options = options;
    }
    return;
  }

  log.info(`Creating subscription ${topic} for ${id}`);
  const listener = {
    id: id,
    topic: topic,
    onMessage: onMessage,
    options: options ?? {},
  };
  listeners.push(listener);
  if (socket.connected) {
    subscriptions.set(
      subscriptionId(listener),
      socket.subscribe(
        topic,
        createDispatcher(listener),
        createOptions(listener),
      ),
    );
  }

  log.info(`${id} connected to ${topic}`);
}

function unsubscribe(id: string, topic: string) {
  log.info(`Deleting subscription ${id} with topic ${topic}`);
  const key = `${topic}-${id}`;
  const subscription = subscriptions.get(key);
  if (subscription) {
    if (socket.connected) {
      subscription.unsubscribe();
    }
    subscriptions.delete(key);
  }
  const existingListenerIndex = listeners.findIndex(
    (listener) => listener.id === id && listener.topic === topic,
  );
  if (existingListenerIndex >= 0) {
    listeners.splice(existingListenerIndex, 1);
  }
}

function setupCommandListener(widgetId: string, reloadFn: Function) {
  subscribe(
    widgetId,
    "/topic/commands",
    (message) => {
      log.debug({ command: message.body }, `Received widget command`);
      let json = JSON.parse(message.body);
      if (json.widgetId === widgetId || json.widgetId === "all") {
        if (json.command === "reload") {
          reloadFn();
          message.ack();
        }
      }
    },
    { durable: "false", autoDelete: "true", ack: "auto", ttl: 1000 * 60 * 5 },
  );
}

function cleanupCommandListener(widgetId: string) {
  unsubscribe(widgetId, "/topic/commands");
}

function publish(topic: string, payload: any) {
  log.debug({ payload: payload }, "sending payload");
  socket.publish({
    destination: topic,
    body: JSON.stringify(payload),
  });
}

export {
  socket,
  subscribe,
  unsubscribe,
  setupCommandListener,
  cleanupCommandListener,
  publish,
};
