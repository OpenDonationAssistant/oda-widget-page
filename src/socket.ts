import { Client, IFrame, messageCallbackType } from "@stomp/stompjs";
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
		onMessage: onMessage
	});

  log.info(`${id} connected`);
}

function setupCommandListener(widgetId: string, reloadFn: Function) {
  subscribe(widgetId, "/topic/commands", (message) => {
    console.log(`Command: ${message.body}`);
    let json = JSON.parse(message.body);
    if (json.id === widgetId || json.id === "all") {
      if (json.command === "reload") {
        reloadFn();
        message.ack();
      }
    }
  });
}
function publish(topic: string, payload: any) {
  socket.publish({
    destination: topic,
    body: JSON.stringify(payload),
  });
}

export { socket, subscribe, setupCommandListener, publish };
