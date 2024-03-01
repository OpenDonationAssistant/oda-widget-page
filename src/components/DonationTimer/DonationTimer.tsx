import React from "react";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./DonationTimer.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import { setupCommandListener, subscribe } from "../../socket";
import FontImport from "../FontImport/FontImport";
import { log } from "../../logging";

export default function DonationTimer({}: {}) {
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const navigate = useNavigate();
  const [lastDonationTime, setLastDonationTime] = useState<number | null>(null);
  const [time, setTime] = useState<String>("");

  useEffect(() => {
    updateDonationTime();

    subscribe(widgetId, conf.topic.alerts, (message) => {
      updateDonationTime();
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
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
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/payments`,
      )
      .then((response) => response.data)
      .then((data) => {
        if (data.length > 0) {
          log.debug(data[0].authorizationTimestamp);
          setLastDonationTime(data[0].authorizationTimestamp);
        }
      });
  }

  const fontSize = findSetting(settings, "fontSize", "24px");
  const font = findSetting(settings, "font", "Roboto");
  const text = findSetting(settings, "text", "Без донатов уже <time>");
  const color = findSetting(settings, "color", "white");
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    color: color,
  };

  return (
    <>
      <FontImport font={font} />
      <div className="donation-timer" style={textStyle}>
        {text ? text.replace("<time>", time) : "Без донатов уже " + time}
      </div>
    </>
  );
}
