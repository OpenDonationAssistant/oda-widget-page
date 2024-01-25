import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./DonatersTopList.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import { setupCommandListener, subscribe } from "../../socket";
import FontImport from "../FontImport/FontImport";

const overflowHiddenForRootElement = (
  <style
    dangerouslySetInnerHTML={{
      __html: `#root {overflow: hidden;}`,
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
        `${process.env.REACT_APP_API_ENDPOINT}/recipient/${recipientId}/donaters?period=${period}`,
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
                [...map.entries()].sort((a, b) => b[1].amount - a[1].amount),
              );
        setDonaters(sortedMap);
      });
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.alerts, (message) => {
      updateDonaters();
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    updateDonaters();
  }, [recipientId]);

  const type = findSetting(settings, "type", "All");
  const titleFontSize = findSetting(settings, "titleFontSize", "24px");
  const fontSize = findSetting(settings, "fontSize", "24px");
  const titleFont = findSetting(settings, "titleFont", "Roboto");
  const font = findSetting(settings, "font", "Roboto");
  const titleColor = findSetting(settings, "titleColor", "white");
  const color = findSetting(settings, "color", "white");
  const title = findSetting(settings, "title", "Донатеры");
  const alphaChannel = findSetting(settings, "alphaChannel", "1.0");
  const titleAlphaChannel = findSetting(settings, "titleAlphaChannel", "1.0");

  // todo rename to listStyle - it's not only text style
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
    lineHeight: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    color: color,
    backgroundColor: `rgba(0, 0, 0, ${alphaChannel})`,
  };
  textStyle.display = layout === "vertical" ? "block" : "inline";
  textStyle.marginLeft = layout === "vertical" ? "0px" : "20px";

  const donatersTopStyle = layout === "vertical" ? {} : { display: "inline" };
  donatersTopStyle.fontSize = titleFontSize + "px";
  donatersTopStyle.fontFamily = titleFont;
  donatersTopStyle.color = titleColor;
  donatersTopStyle.backgroundColor = `rgba(0, 0, 0, ${titleAlphaChannel})`;

  console.log(donatersTopStyle);

  return (
    <>
      <FontImport font={font} />
      <FontImport font={titleFont} />
      {overflowHiddenForRootElement}
      {"All" === type && (
        <div className="donaters-list" style={textStyle}>
          {donaters &&
            donaters.size > 0 &&
            Array.from(donaters.keys()).map((donater) => (
              <span key={donater} style={textStyle} className="donater">
                {donater} - {donaters.get(donater).amount}{" "}
                {donaters.get(donater).currency}{" "}
              </span>
            ))}
        </div>
      )}
      {"Top" === type && (
        <>
          <div style={donatersTopStyle} className="donaters-title">
            {title}
          </div>
          <div className="donaters-top">
            {donaters &&
              donaters.size > 0 &&
              Array.from(donaters.keys())
                .slice(0, topsize)
                .map((donater) => (
                  <div key={donater} style={textStyle} className="donater">
                    {donater} - {donaters.get(donater).amount}{" "}
                    {donaters.get(donater).currency}{" "}
                  </div>
                ))}
          </div>
        </>
      )}
      {"Last" === type && (
        <>
          <div style={donatersTopStyle} className="donaters-title">
            {title}
          </div>
          <div className="donaters-top">
            {donaters &&
              donaters.size > 0 &&
              Array.from(donaters.keys())
                .slice(0, topsize)
                .map((donater) => (
                  <div key={donater} style={textStyle} className="donater">
                    {donater} - {donaters.get(donater).amount}{" "}
                    {donaters.get(donater).currency}{" "}
                  </div>
                ))}
          </div>
        </>
      )}
    </>
  );
}
