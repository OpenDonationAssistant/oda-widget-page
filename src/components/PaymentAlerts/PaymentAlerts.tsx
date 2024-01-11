import React, { useEffect, useRef } from "react";
import classes from "./PaymentAlerts.module.css";
import { useLoaderData, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { log } from "../../logging";
import { setupCommandListener, subscribe } from "../../socket";
import { AlertController } from "../../logic/alert/AlertController";
import MessageBody from "./sections/MessageBody";
import MessageTitle from "./sections/MessageTitle";
import AlertImage from "./sections/AlertImage/AlertImage";
import FontLoader from "../FontLoader/FontLoader";
import ImageCache from "../ImageCache/ImageCache";

function PaymentAlerts({}: {}) {
  const { recipientId, settings, conf, widgetId } = useLoaderData();
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
  }, [widgetId]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: green;}`,
        }}
      />
      <FontLoader fontProvider={alertController.current} />
      <ImageCache imageProvider={alertController.current} />
      <div className={classes.paymentAlerts}>
        <AlertImage alertController={alertController.current} />
        <div className={classes.message}>
          <MessageTitle alertController={alertController.current} />
          <MessageBody alertController={alertController.current} />
        </div>
      </div>
    </>
  );
}

export default PaymentAlerts;
