import React, { useEffect } from "react";
import "./PlayerInfo.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "../../socket";
import { log } from "../../logging";
import FontImport from "../FontImport/FontImport";
import { WidgetData } from "../../types/WidgetData";
import "animate.css";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";

function PlayerInfo() {
  const navigate = useNavigate();
  const [left, setLeft] = useState(0);
  const { settings, conf, widgetId } = useLoaderData() as WidgetData;
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    subscribe(widgetId, conf.topic.player, (message) => {
      log.debug(`Received: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.title !== null) {
        setTitle(json.title);
      }
      if (json.count != null && json.number != null) {
        setLeft(json.count - json.number);
      }
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      unsubscribe(widgetId, conf.topic.player);
      cleanupCommandListener(widgetId);
    };
  }, [widgetId]);

  const titleFontProperty = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "titleFont",
    value: findSetting(settings, "titleFont", null),
  });

  return (
    <>
      {titleFontProperty.createFontImport()}
      <div
        className={`player-info-container ${titleFontProperty.calcClassName()}`}
        style={titleFontProperty.calcStyle()}
        data-vjs-player
      >
        <div className="player-info"></div>
        <span className={`player-info-text`}>
          {title && left > 1 && `Треков в очереди: ${left}, играет ${title}`}
          {title && !(left > 1) && `Играет: ${title}`}
        </span>
      </div>
    </>
  );
}

export default PlayerInfo;
