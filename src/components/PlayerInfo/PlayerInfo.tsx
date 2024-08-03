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
import { WidgetData } from "../../types/WidgetData";
import "animate.css";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import {
  BorderProperty,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../ConfigurationPage/widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import { DEFAULT_ROUNDING_PROPERTY_VALUE, RoundingProperty } from "../ConfigurationPage/widgetproperties/RoundingProperty";

function PlayerInfo() {
  const navigate = useNavigate();
  const [left, setLeft] = useState(0);
  const { settings, conf, widgetId } = useLoaderData() as WidgetData;
  const [title, setTitle] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  useEffect(() => {
    subscribe(widgetId, conf.topic.player, (message) => {
      log.debug(`Received: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.title !== null) {
        setTitle(json.title);
        setOwner(json.owner);
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

  const borderStyle = new BorderProperty({
    widgetId: widgetId,
    name: "widgetBorder",
    value: findSetting(settings, "widgetBorder", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();

  const background = new ColorProperty({
    widgetId: widgetId,
    name: "background",
    tab: "general",
    target: ColorPropertyTarget.BACKGROUND,
    displayName: "label-background",
    value: findSetting(settings, "background", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();

  const rounding = new RoundingProperty({
    widgetId: widgetId,
    name: "rounding",
    tab: "general",
    displayName: "label-background",
    value: findSetting(settings, "rounding", DEFAULT_ROUNDING_PROPERTY_VALUE),
  }).calcCss();

  console.log({background: background});

  const contentStyle = { ...titleFontProperty.calcStyle(), ...borderStyle };
  const widgetStyle =  { ...rounding, ...background };

  return (
    <>
      {titleFontProperty.createFontImport()}
      <div style={widgetStyle}>
        <div
          className={`player-info-container ${titleFontProperty.calcClassName()}`}
          style={contentStyle}
          data-vjs-player
        >
          <div className="player-info"></div>
          <span className={`player-info-text`}>
            {title && left > 1 && `Треков в очереди: ${left}, играет ${title}`}
            {title && !(left > 1) && `Играет: ${title}`}
          </span>
        </div>
      </div>
    </>
  );
}

export default PlayerInfo;
