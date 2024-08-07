import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData } from "react-router";
import { findSetting } from "../utils";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import classes from "./DonationTimer.module.css";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { BorderProperty, DEFAULT_BORDER_PROPERTY_VALUE } from "../ConfigurationPage/widgetproperties/BorderProperty";

export default function DonationTimer({}: {}) {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const [lastDonationTime, setLastDonationTime] = useState<number | null>(null);
  const [time, setTime] = useState<String>("");
  const { widgetId, settings, subscribe, unsubscribe } = useContext(
    WidgetSettingsContext,
  );

  useEffect(() => {
    updateDonationTime();

    subscribe(conf.topic.alerts, (message) => {
      updateDonationTime();
      message.ack();
    });
    return () => {
      unsubscribe(conf.topic.alerts);
    };
  }, [recipientId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!lastDonationTime) {
        return;
      }
      const now = Date.now();
      console.log(now);
      const paymentDate = new Date(lastDonationTime);
      console.log(paymentDate);
      const difference = now - paymentDate.getTime();
      console.log(difference);
      const days = Math.floor(difference / (24 * 36e5));
      const hours = Math.floor((difference % (24 * 36e5)) / 36e5);
      const minutes = Math.floor((difference % 36e5) / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      setTime(
        `${days > 0 ? days + "D " : ""}${hours < 10 ? "0" + hours : hours}:${
          minutes < 10 ? "0" + minutes : minutes
        }:${seconds < 10 ? "0" + seconds : seconds}`,
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, [lastDonationTime]);

  function updateDonationTime() {
    if (findSetting(settings, "resetOnLoad", false)) {
      setLastDonationTime(Date.now());
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/payments`)
      .then((response) => response.data)
      .then((data) => {
        if (data.length > 0) {
          log.debug(data[0].authorizationTimestamp);
          setLastDonationTime(data[0].authorizationTimestamp);
        }
      });
  }

  const text = findSetting(settings, "text", "Без донатов уже <time>");

  const titleFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "titleFont",
    value: findSetting(settings, "titleFont", null),
  });
  const borderStyle =  new BorderProperty({
    widgetId: widgetId,
    name: "border",
    value: findSetting(settings, "border", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();
  const style = {...titleFont.calcStyle(), ...borderStyle}

  return (
    <>
      {titleFont.createFontImport}
      <div
        className={`${classes.timer} ${titleFont.calcClassName()}`}
        style={style}
      >
        {text ? text.replace("<time>", time) : "Без донатов уже " + time}
      </div>
    </>
  );
}
