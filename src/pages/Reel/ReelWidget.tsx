import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "../../socket";
import classes from "./ReelWidget.module.css";
import { log } from "../../logging";
import { findSetting } from "../../components/utils";
import { WidgetData } from "../../types/WidgetData";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";

export default function ReelWidget({}) {
  const { settings, conf, widgetId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();
  const glideRef = useRef<HTMLDivElement | null>(null);
  const glide = useRef<Glide | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);

  function handleSelection(selection: string) {
    if (!glideRef.current?.classList.contains("hidden")) {
      setTimeout(() => handleSelection(selection), 40000);
      return;
    }
    setActive(selection);
    const time = findSetting(settings, "time", 10) * 1000;
    setTimeout(() => {
      log.debug(`clear active and highlight`);
      setActive(null);
      setHighlight(false);
      glideRef.current?.classList.add("hidden");
    }, time + 20000);
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.reel, (message) => {
      log.info({ message: message }, "Received reel command");
      let json = JSON.parse(message.body);
      // if (json.widgetId === widgetId ) {
      handleSelection(json.selection);
      // }
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      unsubscribe(widgetId, conf.topic.reel);
      cleanupCommandListener(widgetId);
    };
  }, [widgetId]);

  useEffect(() => {
    if (!glideRef || !options) {
      return;
    }

    const perView = findSetting(settings, "perView", 5);
    const speed = findSetting(settings, "speed", 250);
    glide.current = new Glide(".glide", {
      type: "carousel",
      perView: perView,
      rewind: true,
      animationDuration: speed,
      focusAt: "center",
    }).mount();
  }, [glideRef, options]);

  useEffect(() => {
    if (!active) {
      return;
    }
    glideRef.current?.classList.remove("hidden");
    log.debug(`selecting ${active} for reel`);
    const index = options.findIndex((option) => option === active);
    log.debug({ options: options, index: index }, "highlight");
    const speed = findSetting(settings, "speed", 250);
    const time = findSetting(settings, "time", 10) * 1000;
    glide.current?.update({ autoplay: speed });
    setTimeout(() => {
      const index = options.findIndex((option) => option === active);
      log.debug({ options: options, index: index }, "highlight");
      glide.current?.update({ autoplay: false, startAt: index });
      setHighlight(true);
    }, time);
  }, [active]);

  useEffect(() => {
    const shuffle = findSetting(settings, "shuffle", true);
    let options = structuredClone(findSetting(settings, "optionList", []));
    if (shuffle) {
      let shuffled = [];
      const count = options.length;
      for (let i = 0; i < count; i++) {
        const index = getRndInteger(0, options.length);
        shuffled.push(options[index]);
        options.splice(index, 1);
      }
      options = shuffled;
    }
    setOptions(options);
  }, [widgetId]);

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const titleFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "titleFont",
    value: findSetting(settings, "titleFont", null),
  });
  const borderColor = findSetting(settings, "borderColor", "red");
  const borderWidth = findSetting(settings, "borderWidth", 30);
  const selectionColor = findSetting(settings, "selectionColor", "green");
  const slideStyle = {
    borderColor: borderColor,
    alignItems: "stretch",
  };
  const backgroundImage = findSetting(settings, "backgroundImage", "");

  function calcItemStyle(option: string) {
    const style = {};
    style.borderColor = borderColor;
    style.borderWidth = `${borderWidth}px`;
    if (highlight && active === option) {
      style.backgroundColor = selectionColor;
    } else {
      if (backgroundImage) {
        style.backgroundSize = "cover";
        style.backgroundImage = `url(${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${backgroundImage})`;
      }
    }
    log.debug({ style }, "calculated style for slide item");
    return style;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: "rgba(0,0,0,0)";}`,
        }}
      />
      {titleFont.createFontImport()}
      <div className={titleFont.calcClassName()} style={titleFont.calcStyle()}>
        <div className={`glide hidden`} ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides" style={slideStyle}>
              {options.map((option) => (
                <div
                  key={option}
                  style={calcItemStyle(option)}
                  className={`${classes.reelitemcontainer} ${
                    highlight && active === option
                      ? classes.active
                      : classes.notactive
                  }`}
                >
                  <li
                    key={option}
                    className={`glide__slide ${classes.reelitem}`}
                  >
                    {option}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
