import React, { CSSProperties, useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData } from "react-router";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import classes from "./DonationTimer.module.css";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { DonationTimerWidgetSettingsContext } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { Flex } from "antd";

export default function DonationTimer({}: {}) {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const [lastDonationTime, setLastDonationTime] = useState<number | null>(null);
  const [time, setTime] = useState<String>("");
  const { subscribe, unsubscribe } = useContext(WidgetSettingsContext);
  const settings = useContext(DonationTimerWidgetSettingsContext);

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
      const paymentDate = new Date(lastDonationTime);
      const difference = now - paymentDate.getTime();
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
    if (settings.resetOnLoad) {
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

  const text = settings.textProperty;

  const fontStyle = settings.titleFontProperty.calcStyle();

  const backgroundStyle = settings.backgroundColorProperty.calcCss();

  const borderStyle = settings.borderProperty.calcCss();

  const roundingStyle = settings.roundingProperty.calcCss();

  const paddingStyle = settings.paddingProperty.calcCss();

  const filterStyle = settings.blurProperty.calcCss();

  const boxShadowStyle = settings.boxShadowProperty.calcCss();

  const heightStyle: CSSProperties = {
    height: `calc(100% - ${2 * settings.boxShadowProperty.requiredHeight}px)`,
    marginTop: `${settings.boxShadowProperty.requiredHeight}px`,
  };

  const widthStyle: CSSProperties = {
    width: `calc(100% - ${2 * settings.boxShadowProperty.requiredWidth}px)`,
    marginLeft: `${settings.boxShadowProperty.requiredWidth}px`,
  };

  return (
    <>
      {settings.titleFontProperty.createFontImport()}
      {time && (
        <Flex
          align="center"
          justify="flex-start"
          id="donationTimer"
          style={{
            ...paddingStyle,
            ...borderStyle,
            ...roundingStyle,
            ...boxShadowStyle,
            ...heightStyle,
            ...widthStyle
          }}
          className={`${classes.timer}`}
        >
          <div
            style={{
              ...backgroundStyle,
              ...filterStyle,
              ...roundingStyle,
            }}
            className={`${classes.background}`}
          ></div>
          <div
            style={{
              ...fontStyle,
              ...{ textAlign: settings.textAlign },
            }}
            className={`${classes.text} ${settings.titleFontProperty.calcClassName()}`}
          >
            {text.replace("<time>", `${time}`)}
          </div>
        </Flex>
      )}
    </>
  );
}
