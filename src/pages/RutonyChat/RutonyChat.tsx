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

      var jData = {
          "username": json.nickname,
          "text": json.message,
          "amount": json.amount.major,
          "currency": "RUB"
      }

      var j = {
          "type": "donate",
          "data": JSON.stringify(jData)
      };

      const messageToSend = {
        "type": "Donate",
        "data": {
          jData
        }
      };
        // nick: json.nickname,
        // site: "oda.digital",
        // text: json.message,
        // summ: `${json.amount.major}`,
        // summf: `${json.amount.major}`,
        // test: false,
      log.debug({ message: messageToSend }, "Sending message");
      socket.send(JSON.stringify(j));
      // socket.send(JSON.stringify(messageToSend));
      message.ack();
    });
    setSocket(socket);
    socket.onerror = (error) => {
      log.debug("Error: '" + error + "'");
    };

    socket.onmessage = (message => {
      log.debug({ message: message, }, "Received message");
    })

    return () => {
      log.debug("Closing socket");
      socket.close;
    }

  }, [widgetId]);

  return <>{socket && <p>Connected to ws://127.0.0.1:8383/Donate</p>}</>;
}
