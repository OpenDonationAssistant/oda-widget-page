import { Client, messageCallbackType } from "@stomp/stompjs";
import { log } from "./logging";

interface Listener {
  id: string;
  topic: string;
  onMessage: messageCallbackType;
}

const socket = new Client({
  brokerURL: process.env.REACT_APP_WS_ENDPOINT,
});
socket.reconnectDelay = 500;
log.debug("Creating socket client");
var listeners: Listener[] = [];
socket.activate();
socket.onConnect = () => {
  listeners.forEach((listener) => {
    socket.subscribe(listener.topic, listener.onMessage, {
      id: `${listener.id}-${listener.topic}`,
      durable: "true",
      "auto-delete": "false",
      ack: "client",
    });
    log.debug(`Subscribed to ${listener.topic} for ${listener.id}`);
  });
};

function subscribe(id: string, topic: string, onMessage: messageCallbackType) {
  log.info(`Creating subscription ${topic} for ${id}`);
  if (socket.connected) {
    socket.subscribe(topic, onMessage, {
      id: `${id}-${topic}`,
      durable: "true",
      "auto-delete": "false",
      ack: "client",
    });
  }
  listeners.push({
    id: id,
    topic: topic,
    onMessage: onMessage,
  });

  log.info(`${id} connected to ${topic}`);
}

function unsubscribe(id: string, topic: string) {
  log.info(`Deleting subscription ${id} with topic ${topic}`);
  socket.unsubscribe(`${id}-${topic}`);
  const existingListenerIndex = listeners.findIndex(
    (listener) => listener.id === id && listener.topic === topic,
  );
  listeners.splice(existingListenerIndex, 1);
}

function setupCommandListener(widgetId: string, reloadFn: Function) {
  subscribe(widgetId, "/topic/commands", (message) => {
    log.debug({command: message.body}, `Received widget command`);
    let json = JSON.parse(message.body);
    if (json.id === widgetId || json.id === "all") {
      if (json.command === "reload") {
        reloadFn();
        message.ack();
      }
    }
  });
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
