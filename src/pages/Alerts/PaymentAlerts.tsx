import { useEffect, useRef } from "react";
import classes from "./PaymentAlerts.module.css";
import { useLoaderData } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { log } from "../../logging";
import { subscribe } from "../../socket";
import { AlertController } from "./AlertController";
import { WidgetData } from "../../types/WidgetData";
import { Flex } from "antd";
import { AlertStateContext } from "./AlertState";
import FontLoader from "./sections/FontLoader/FontLoader";
import { AlertImage } from "./sections/AlertImage/AlertImage";
import { MessageTitle } from "./sections/MessageTitle/MessageTitle";
import { MessageBody } from "./sections/MessageBody/MessageBody";

function PaymentAlerts({}: {}) {
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;

  const alertController = useRef<AlertController>(
    new AlertController(settings, recipientId),
  );

  useEffect(() => {
    alertController.current.listen(widgetId, conf);
  }, [alertController]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.alertWidgetCommans, (message) => {
      log.info(`Alerts command: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.command === "interrupt") {
        alertController.current?.interrupt();
      }
      message.ack();
    });
  }, [widgetId]);

  return (
    <AlertStateContext.Provider value={alertController.current.state}>
      <FontLoader />
      <Flex
        vertical
        justify="flex-start"
        align="center"
        className={`${classes.paymentAlerts}`}
      >
        <AlertImage />
        <div className={classes.message}>
          <MessageTitle />
          <MessageBody />
        </div>
      </Flex>
    </AlertStateContext.Provider>
  );

}

export default PaymentAlerts;
