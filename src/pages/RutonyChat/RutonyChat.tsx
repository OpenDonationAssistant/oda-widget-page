import { useEffect, useState } from "react";
import { WidgetData } from "../../types/WidgetData";
import { useLoaderData } from "react-router";
import { subscribe } from "../../socket";
import { log } from "../../logging";

export default function DonatonWidget({}) {
  const { widgetId, conf } = useLoaderData() as WidgetData;
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    log.debug("Connecting to ws://127.0.0.1:8383/Donate");
    const socket = new WebSocket("ws://127.0.0.1:8383/Donate");
    socket.onmessage = (event) => {
      log.debug({ message: event.data }, "Received message");
    }
    subscribe(widgetId, conf.topic.alerts, (message) => {
      const json = JSON.parse(message.body);
      const messageToSend = {
        nick: json.nickname,
        site: "oda.digital",
        text: json.message,
        summ: `${json.amount.major}`,
        summf: `${json.amount.major}`,
        test: false,
      };
      log.debug({ message: messageToSend }, "Sending message");
      socket.send(JSON.stringify(messageToSend));
      message.ack();
    });
    setSocket(socket);
    return socket.close;
  }, [widgetId]);

  return <>{socket && <p>Connected to ws://127.0.0.1:8383/Donate</p>}</>;
}
