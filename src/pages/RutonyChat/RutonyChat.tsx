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
    const listAlertSocket = new WebSocket("ws://127.0.0.1:8383/Donate");
    listAlertSocket.onmessage = (event) => {
      log.info({ message: event.data }, "Received alert message");
    };

    const localsocket = new WebSocket("ws://127.0.0.1:8383/Donate");
    localsocket.onmessage = (event) => {
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
      localsocket.send(JSON.stringify(j));
      localsocket.send(JSON.stringify(messageToSend));
      message.ack();
    });
    setSocket(localsocket);
    return localsocket.close;
  }, [widgetId]);

  return <>{socket && <p>Connected to ws://127.0.0.1:8383/Donate</p>}</>;
}
