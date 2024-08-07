import React, { useContext, useEffect } from "react";
import "./PlayerInfo.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
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
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import {
  DEFAULT_ROUNDING_PROPERTY_VALUE,
  RoundingProperty,
} from "../ConfigurationPage/widgetproperties/RoundingProperty";
import { Col, Flex, Row } from "antd";
import {
  DEFAULT_PADDING_PROPERTY_VALUE,
  PaddingProperty,
} from "../ConfigurationPage/widgetproperties/PaddingProperty";
import Marquee from "react-fast-marquee";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";

function PlayerInfo() {
  const [left, setLeft] = useState(0);
  const { conf } = useLoaderData() as WidgetData;
  const [title, setTitle] = useState<string | null>();
  const [owner, setOwner] = useState<string | null>();
  const { widgetId, settings, subscribe, unsubscribe, publish } = useContext(
    WidgetSettingsContext,
  );

  useEffect(() => {
    subscribe(conf.topic.player, (message) => {
      log.debug({ body: message.body }, `Received message`);
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
    publish(conf.topic.playerCommands, { command: "state" });
    return () => {
      unsubscribe(conf.topic.player);
    };
  }, [widgetId]);

  const titleFontProperty = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "titleFont",
    value: findSetting(settings, "titleFont", null),
  });

  const requesterFontProperty = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "requesterFont",
    value: findSetting(settings, "requesterFont", null),
  });

  const queueFontProperty = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "queueFont",
    value: findSetting(settings, "queueFont", undefined),
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
    value: findSetting(settings, "background", DEFAULT_COLOR_PROPERTY_VALUE),
  }).calcCss();

  const rounding = new RoundingProperty({
    widgetId: widgetId,
    name: "rounding",
    tab: "general",
    displayName: "label-background",
    value: findSetting(settings, "rounding", DEFAULT_ROUNDING_PROPERTY_VALUE),
  }).calcCss();

  const padding = new PaddingProperty({
    widgetId: widgetId,
    name: "padding",
    tab: "general",
    value: findSetting(settings, "padding", DEFAULT_PADDING_PROPERTY_VALUE),
  }).calcCss();

  const contentStyle = { ...titleFontProperty.calcStyle(), ...borderStyle };

  const useOnelineWidget = findSetting(settings, "widgetType", "Старый");
  const showRequester = findSetting(settings, "showRequester", "show");
  const showQueueSize = findSetting(settings, "showQueueSize", "show");

  const titleBackground = new ColorProperty({
    widgetId: widgetId,
    name: "titleBackground",
    tab: "general",
    target: ColorPropertyTarget.BACKGROUND,
    displayName: "label-background",
    value: findSetting(settings, "titleBackground", null),
  }).calcCss();

  const titleBorder = new BorderProperty({
    widgetId: widgetId,
    name: "titleBorder",
    value: findSetting(settings, "titleBorder", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();

  const titleRounding = new RoundingProperty({
    widgetId: widgetId,
    name: "titleRounding",
    tab: "general",
    displayName: "label-background",
    value: findSetting(
      settings,
      "titleRounding",
      DEFAULT_ROUNDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const titlePadding = new PaddingProperty({
    widgetId: widgetId,
    name: "titlePadding",
    tab: "general",
    value: findSetting(
      settings,
      "titlePadding",
      DEFAULT_PADDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const requesterBackground = new ColorProperty({
    widgetId: widgetId,
    name: "requesterBackground",
    tab: "general",
    target: ColorPropertyTarget.BACKGROUND,
    displayName: "label-background",
    value: findSetting(settings, "requesterBackground", null),
  }).calcCss();

  const requesterBorder = new BorderProperty({
    widgetId: widgetId,
    name: "requesterBorder",
    value: findSetting(settings, "requesterBorder", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();

  const requesterRounding = new RoundingProperty({
    widgetId: widgetId,
    name: "requesterRounding",
    tab: "general",
    displayName: "label-background",
    value: findSetting(
      settings,
      "requesterRounding",
      DEFAULT_ROUNDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const requesterPadding = new PaddingProperty({
    widgetId: widgetId,
    name: "requesterPadding",
    tab: "general",
    value: findSetting(
      settings,
      "requesterPadding",
      DEFAULT_PADDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const queueBackground = new ColorProperty({
    widgetId: widgetId,
    name: "queueBackground",
    tab: "general",
    target: ColorPropertyTarget.BACKGROUND,
    displayName: "label-background",
    value: findSetting(settings, "queueBackground", null),
  }).calcCss();

  const queueRounding = new RoundingProperty({
    widgetId: widgetId,
    name: "queueRounding",
    tab: "general",
    displayName: "label-background",
    value: findSetting(
      settings,
      "queueRounding",
      DEFAULT_ROUNDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const queuePadding = new PaddingProperty({
    widgetId: widgetId,
    name: "queuePadding",
    tab: "general",
    value: findSetting(
      settings,
      "queuePadding",
      DEFAULT_PADDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const queueBorder = new BorderProperty({
    widgetId: widgetId,
    name: "queueBorder",
    value: findSetting(settings, "queueBorder", DEFAULT_BORDER_PROPERTY_VALUE),
  }).calcCss();

  const onelineWidget = () => {
    return (
      <>
        {titleFontProperty.createFontImport()}
        <div style={{ ...rounding, ...background }}>
          <div
            className={`player-info-container ${titleFontProperty.calcClassName()}`}
            style={contentStyle}
          >
            <span className={`player-info-text`}>
              {title &&
                left > 1 &&
                `Треков в очереди: ${left}, играет ${title}`}
              {title && !(left > 1) && `Играет: ${title}`}
            </span>
          </div>
        </div>
      </>
    );
  };

  const multilineWidget = () => {
    if (!title) {
      return  <></>;
    }
    return (
      <>
        <Flex
          vertical={true}
          justify="space-between"
          style={{
            ...{ height: "100%" },
            ...rounding,
            ...background,
            ...borderStyle,
            ...padding,
          }}
        >
          <div
            style={{ ...titleBackground, ...titleRounding, ...titlePadding,...titleBorder }}
          >
            <Flex
              align="center"
              gap={10}
              style={{
                ...{ overflow: "hidden" },
                ...titleFontProperty.calcStyle(),
              }}
              className={titleFontProperty.calcClassName()}
            >
              <span className="material-symbols-sharp">music_cast</span>
              <Marquee>
                <span style={{ marginRight: "10px" }}>{title}</span>
              </Marquee>
            </Flex>
          </div>
          <Row align="middle">
            <Col
              span={12}
              style={{
                ...requesterPadding,
                ...requesterBackground,
                ...requesterRounding,
                ...requesterBorder
              }}
            >
              {owner && showRequester === "show" && (
                <Flex
                  align="center"
                  gap={5}
                  justify="flex-start"
                  style={requesterFontProperty.calcStyle()}
                  className={requesterFontProperty.calcClassName()}
                >
                  <span
                    style={{ fontWeight: "900" }}
                    className="material-symbols-sharp"
                  >
                    face
                  </span>
                  <div>{owner}</div>
                </Flex>
              )}
            </Col>
            <Col
              span={12}
              style={{ ...queueBackground, ...queuePadding, ...queueRounding,...queueBorder }}
            >
              {left > 0 && showQueueSize  ==="show" && (
                <Flex
                  align="center"
                  gap={5}
                  justify="flex-end"
                  style={queueFontProperty.calcStyle()}
                  className={queueFontProperty.calcClassName()}
                >
                  <span className="material-symbols-sharp">playlist_play</span>
                  <div>{left}</div>
                </Flex>
              )}
            </Col>
          </Row>
        </Flex>
      </>
    );
  };

  return useOnelineWidget === "Старый" ? onelineWidget() : multilineWidget();
}

export default PlayerInfo;
