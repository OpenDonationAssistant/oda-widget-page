import React, { useEffect, useRef, useState } from "react";
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
import MessageBody from "./sections/MessageBody";
import MessageTitle from "./sections/MessageTitle";
import AlertImage from "./sections/AlertImage/AlertImage";
import FontLoader from "../FontLoader/FontLoader";
import ImageCache from "../ImageCache/ImageCache";
import { findSetting } from "../utils";
import { WidgetData } from "../../types/WidgetData";

function PaymentAlerts({}: {}) {
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;
  const navigate = useNavigate();
  const [useGreenscreen, setUseGreenscreen] = useState<boolean>(true);
  const alertController = useRef<AlertController>(
    new AlertController(settings, recipientId),
  );

  useEffect(() => {
    alertController.current.listen(widgetId, conf);
  }, [alertController]);

  useEffect(() => {
    setUseGreenscreen(findSetting(settings, "useGreenscreen", false));
  }, [settings]);

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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: ${
            useGreenscreen ? "green" : "rgba(0,0,0,0)"
          };}`,
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
