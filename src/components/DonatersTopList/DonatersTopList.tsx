import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./DonatersTopList.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import { setupCommandListener, subscribe } from "../../socket";
import FontImport from "../FontImport/FontImport";

export default function DonatersTopList({}: {}) {
  const [donaters, setDonaters] = useState(new Map());
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const navigate = useNavigate();

  const period = findSetting(settings, "period", "month");
  const topsize = findSetting(settings, "topsize", 3);

  function updateDonaters() {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/recipient/${recipientId}/donaters?period=${period}`,
      )
      .then((response) => response.data)
      .then((data) => {
        const map = new Map();
        Object.keys(data).forEach((key) => map.set(key, data[key]));
        const sortedMap = new Map(
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
  const fontSize = findSetting(settings, "fontSize", "24px");
  const font = findSetting(settings, "font", "Roboto");
  const color = findSetting(settings, "color", "white");
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
		lineHeight: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    color: color,
  };

  return (
    <>
      <FontImport font={font} />
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
          <div style={textStyle} className="donaters-top">
            Топ {topsize} {period === "day" && <span>дня</span>}
            {period === "month" && <span>месяца</span>}
          </div>
          <div style={textStyle} className="donaters-top">
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
