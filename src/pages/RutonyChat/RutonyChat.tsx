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
    };
    subscribe(widgetId, conf.topic.alerts, (message) => {
      const json = JSON.parse(message.body);

      var data = {
          "username": json.nickname,
          "text": json.message,
          "amount": json.amount.major,
          "currency": "RUB"
      }

      var request = {
          "type": "donate",
          "data": JSON.stringify(data)
      };

      socket.send(JSON.stringify(request));
      message.ack();
    });
    setSocket(socket);
    socket.onerror = (error) => {
      log.debug("Error: '" + error + "'");
    };

    socket.onmessage = (message => {
      log.debug({ message: message, }, "Received message");
    })

    return socket.close;
  }, [widgetId]);

  return <>{socket && <p>Connected to ws://127.0.0.1:8383/Donate</p>}</>;
}
