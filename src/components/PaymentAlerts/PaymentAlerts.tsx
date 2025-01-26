import { useEffect, useRef } from "react";
import classes from "./PaymentAlerts.module.css";
import { useLoaderData, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { log } from "../../logging";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "../../socket";
import { AlertController } from "../../logic/alert/AlertController";
import FontLoader from "./sections/FontLoader/FontLoader";
import { WidgetData } from "../../types/WidgetData";
import { AlertImage } from "./sections/AlertImage/AlertImage";
import { MessageTitle } from "./sections/MessageTitle/MessageTitle";
import { MessageBody } from "./sections/MessageBody/MessageBody";
import { ImageCache } from "./sections/ImageCache/ImageCache";
import { Flex } from "antd";
import { AlertStateContext } from "./AlertState";

function PaymentAlerts({}: {}) {
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;
  const navigate = useNavigate();

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
      if (json.command === "reload") {
        navigate(0);
      }
      if (json.command === "interrupt") {
        alertController.current?.interrupt();
      }
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      unsubscribe(widgetId, conf.topic.alertWidgetCommans);
      cleanupCommandListener(widgetId);
    };
  }, [widgetId]);

  return (
    <AlertStateContext.Provider value={alertController.current.state}>
      <FontLoader />
      <ImageCache />
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
