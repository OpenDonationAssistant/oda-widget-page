import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./DonatersTopList.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "../../socket";
import FontImport from "../FontImport/FontImport";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";

const overflowHiddenForRootElement = (
  <style
    dangerouslySetInnerHTML={{
      __html: `#root {overflow: hidden;}`,
    }}
  />
);

const fullHeight = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html, body { height: 100%; }`,
    }}
  />
);

export default function DonatersTopList({}: {}) {
  const [donaters, setDonaters] = useState(new Map());
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const navigate = useNavigate();

  const period = findSetting(settings, "period", "month");
  const topsize = findSetting(settings, "topsize", 3);
  const layout = findSetting(settings, "layout", "vertical");

  function updateDonaters() {
    axios
      .get(
        `${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/recipients/${recipientId}/donaters?period=${period}`,
      )
      .then((response) => response.data)
      .then((data) => {
        const map = new Map();
        Object.keys(data)
          .filter((key) => key)
          .forEach((key) => {
            map.set(key, data[key]);
          });
        const sortedMap =
          type === "Last"
            ? map
            : new Map(
                [...map.entries()].sort((a, b) => b[1].major - a[1].major),
              );
        setDonaters(sortedMap);
      });
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.alerts, (message) => {
      setTimeout(() => {
        updateDonaters();
        message.ack();
      }, 3000);
    });
    setupCommandListener(widgetId, () => navigate(0));
    updateDonaters();
    return () => {
      unsubscribe(widgetId, conf.topic.alerts);
      cleanupCommandListener(widgetId);
    };
  }, [recipientId]);

  const type = findSetting(settings, "type", "All");

  const title = findSetting(settings, "title", "Донатеры");
  const titleBackgroundColor = findSetting(
    settings,
    "titleBackgroundColor",
    "white",
  );
  const backgroundColor = findSetting(settings, "backgroundColor", "white");
  const headerFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "headerFont",
    value: findSetting(settings, "headerFont", null),
  });
  const messageFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "messageFont",
    value: findSetting(settings, "messageFont", null),
  });

  const textStyle = messageFont.calcStyle();
  textStyle.display = layout === "vertical" ? "block" : "inline";
  textStyle.marginLeft = layout === "vertical" ? "0px" : "20px";

  const donatersTopStyle = headerFont.calcStyle();
  if (layout === "vertical") {
    donatersTopStyle.display = "inline";
  }
  donatersTopStyle.backgroundColor = titleBackgroundColor;

  return (
    <>
      {headerFont.createFontImport()}
      {messageFont.createFontImport()}
      {overflowHiddenForRootElement}
      {fullHeight}
      <style
        dangerouslySetInnerHTML={{
          __html: `#root { background-color: ${backgroundColor}; }`,
        }}
      />
      {"All" === type && (
        <div className={`donaters-list`} style={textStyle}>
          {donaters &&
            donaters.size > 0 &&
            Array.from(donaters.keys()).map((donater) => (
              <span
                key={donater}
                style={textStyle}
                className={`donater ${messageFont.calcClassName()}`}
              >
                {donater} - {donaters.get(donater).major}{" "}
                {donaters.get(donater).currency}{" "}
              </span>
            ))}
        </div>
      )}
      {"Top" === type && (
        <>
          <div
            style={donatersTopStyle}
            className={`donaters-title ${headerFont.calcClassName()}`}
          >
            {title}
          </div>
          <div className="donaters-top">
            {donaters &&
              donaters.size > 0 &&
              Array.from(donaters.keys())
                .slice(0, topsize)
                .map((donater) => (
                  <div
                    key={donater}
                    style={textStyle}
                    className={`donater ${messageFont.calcClassName()}`}
                  >
                    {donater} - {donaters.get(donater).major}{" "}
                    {donaters.get(donater).currency}{" "}
                  </div>
                ))}
          </div>
        </>
      )}
      {"Last" === type && (
        <>
          <div
            style={donatersTopStyle}
            className={`donaters-title ${headerFont.calcClassName()}`}
          >
            {title}
          </div>
          <div className="donaters-top">
            {donaters &&
              donaters.size > 0 &&
              Array.from(donaters.keys())
                .slice(0, topsize)
                .map((donater) => (
                  <div
                    key={donater}
                    style={textStyle}
                    className={`donater ${messageFont.calcClassName()}`}
                  >
                    {donater} - {donaters.get(donater).major}{" "}
                    {donaters.get(donater).currency}{" "}
                  </div>
                ))}
          </div>
        </>
      )}
    </>
  );
}
