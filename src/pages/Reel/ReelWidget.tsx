import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { setupCommandListener, subscribe } from "../../socket";
import classes from "./ReelWidget.module.css";
import { log } from "../../logging";
import { findSetting } from "../../components/utils";

export default function ReelWidget({}) {
  const { settings, conf, widgetId } = useLoaderData();
  const navigate = useNavigate();
  const glideRef = useRef<HTMLDivElement | null>(null);
  const glide = useRef<Glide | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<boolean>(false);

  function handleSelection(selection: string){
      if (!glideRef.current?.classList.contains("hidden")) {
        setTimeout(() => handleSelection(selection), 40000);
        return;
      }
      setActive(selection);
      setTimeout(() => {
        log.debug(`clear active and highlight`);
        setActive(null);
        setHighlight(false);
        glideRef.current?.classList.add("hidden");
      }, 20000);
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.reel, (message) => {
      log.info(`Received reel command: ${message.body}`);
      let json = JSON.parse(message.body);
      handleSelection(json.selection);
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
  }, [widgetId]);

  useEffect(() => {
    if (!glideRef) {
      return;
    }

    glide.current = new Glide(".glide", {
      type: "carousel",
      perView: options.length,
      rewind: true,
      animationDuration: 140,
      focusAt: "center",
    }).mount();
  }, [glideRef]);

  useEffect(() => {
    if (!active) {
      return;
    }
    glideRef.current?.classList.remove("hidden");
    log.debug(`selecting ${active} for reel`);
    setupScroll(
      glide.current,
      40,
      () => {
        const index = options.findIndex((option) => option === active);
        log.debug(`highlight ${index} from ${JSON.stringify(options)}`);
        glide.current.update({ startAt: index });
        setHighlight(true);
      },
      options.length,
    );
  }, [active]);

  function setupScroll(
    glide: any,
    iteration: number,
    result: Function,
    itemsCount: number,
  ) {
    if (iteration < 1) {
      result();
      return;
    }
    const selected = getRndInteger(0, itemsCount);
    const scroll = () => {
      glide.go(">");
      glide.go(">");
    }
    console.log(`selected: ${selected}`);
    if (iteration === 1) {
      console.log(`setActive to ${selected}`);
    }
    setTimeout(() => {
      scroll();
      setupScroll(glide, iteration - 1, result, itemsCount);
    }, 140);
  }

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const fontSize = findSetting(settings, "fontSize", "24px");
  const font = findSetting(settings, "font", "Roboto");
  const color = findSetting(settings, "color", "white");
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    color: color,
  };
  const options = findSetting(settings, "optionList", []);
  const borderColor = findSetting(settings, "borderColor", "red");
  const selectionColor = findSetting(settings, "selectionColor", "green");
  const slideStyle = {
    borderColor: borderColor,
  };
  const backgroundImage = findSetting(settings, "backgroundImage", "");

  function calcItemStyle(option: string){
    const style = {};
    if (highlight && active === option){
      style.backgroundColor = selectionColor;
    } else {
      if (backgroundImage) {
        style.backgroundSize = "cover";
        style.backgroundImage = `url(${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${backgroundImage})`;
      }
    }
    log.debug({style}, "calculated style for slide item");
    return style;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: "rgba(0,0,0,0)";}`,
        }}
      />
      <div style={textStyle}>
        <div className={`glide hidden`} ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides" style={slideStyle}>
              {options.map((option) => (
                <div
                  key={option}
                  style={{
                    backgroundImage: `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${backgroundImage}`,
                  }}
                >
                  <li
                    key={option}
                    style={calcItemStyle(option)}
                    className={`glide__slide ${classes.reelitem} ${
                      highlight && active === option ? classes.active : ""
                    }`}
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
