import React, { ReactNode, useEffect } from "react";
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
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { WidgetData } from "../../types/WidgetData";
import { Carousel, Flex } from "antd";

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
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;
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
  textStyle.textAlign = "center";
  textStyle.maxWidth = "100vw";
  textStyle.width = "50vw";
  textStyle.flex = "1 0 auto";

  const donatersTopStyle = headerFont.calcStyle();
  donatersTopStyle.backgroundColor = titleBackgroundColor;

  const hideEmpty = findSetting(settings, "hideEmpty", false);

  if (hideEmpty && (!donaters || donaters.size == 0)) {
    return (
      <>
        {overflowHiddenForRootElement}
        {fullHeight}
        <style
          dangerouslySetInnerHTML={{
            __html: `#root { background-color: ${backgroundColor}; }`,
          }}
        />
      </>
    );
  }

  const carouselSettings = findSetting(settings, "carousel", { enabled: false });
  const packSize = carouselSettings.enabled ? carouselSettings.amount : topsize;

  function portion(): ReactNode[] {
    if (!donaters) {
      return [];
    }
    let packs = [];
    let origin = Array.from(donaters.keys());
    for (let start = 0; start < donaters.size; ) {
      let end = start + packSize;
      if (end > topsize) {
        end = topsize;
      }
      const label = origin.slice(start, end).map((donater) => (
        <div key={start} className={`${messageFont.calcClassName()}`}>
          {donater} - {donaters.get(donater).major}{" "}
          {donaters.get(donater).currency}
        </div>
      ));
      packs[packs.length] = label;
      start = start + packSize;
    }
    return packs;
  }

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
      <Flex vertical={layout === "vertical"}>
        <div
          style={donatersTopStyle}
          className={`donaters-title ${headerFont.calcClassName()}`}
        >
          {title}
        </div>
        <Carousel adaptiveHeight={true} style={textStyle} autoplay dots={false}>
          {portion().map((pack) => (
            <div>
              <Flex justify="space-around">{pack}</Flex>
            </div>
          ))}
        </Carousel>
      </Flex>
    </>
  );
}
