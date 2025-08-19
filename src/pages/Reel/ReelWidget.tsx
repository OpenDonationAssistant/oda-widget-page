import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import { useEffect, useRef, useState } from "react";
import classes from "./ReelWidget.module.css";
import { log } from "../../logging";
import { findSetting } from "../../components/utils";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { DEFAULT_BORDER_PROPERTY_VALUE } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { ReelWidgetSettings } from "./ReelWidgetSettings";
import { ReelStore } from "../../stores/ReelStore";
import { observer } from "mobx-react-lite";
import { fullUri } from "../../utils";

export const ReelWidget = observer(
  ({ settings, store }: { settings: ReelWidgetSettings; store: ReelStore }) => {
    const glideRef = useRef<HTMLDivElement | null>(null);
    const glide = useRef<Glide | null>(null);
    const [highlight, setHighlight] = useState<boolean>(false);
    const [image, setImage] = useState<string>("");

    useEffect(() => {
      if (!glideRef || !store.options) {
        return;
      }

      glide.current = new Glide(".glide", {
        type: "carousel",
        perView: settings.perViewProperty.value,
        rewind: true,
        animationDuration: settings.speedProperty.value,
        focusAt: "center",
      }).mount();
    }, [glideRef, store.options]);

    useEffect(() => {
      if (!store.selection) {
        setHighlight(false);
        glideRef.current?.classList.add("hidden");
        return;
      }
      glideRef.current?.classList.remove("hidden");
      log.debug(`selecting ${store.selection} for reel`);
      const index = store.options.findIndex(
        (option) => option === store.selection,
      );
      log.debug({ options: store.options, index: index }, "highlight");
      const speed = settings.speedProperty.value;
      const time = findSetting(settings, "time", 10) * 1000;
      glide.current?.update({ autoplay: speed });
      setTimeout(() => {
        const index = store.options.findIndex(
          (option) => option === store.selection,
        );
        log.debug({ options: store.options, index: index }, "highlight");
        glide.current?.update({ autoplay: false, startAt: index });
        setHighlight(true);
      }, time);
    }, [store.selection]);

    const titleFont = new AnimatedFontProperty({
      name: "titleFont",
      value: findSetting(settings, "titleFont", null),
    });

    const selectionStyle = settings.selectionColorProperty.calcCss();

    const slideStyle = {
      alignItems: "stretch",
    };

    useEffect(() => {
      let backgroundImage = findSetting(settings, "backgroundImage", "");
      fullUri(backgroundImage).then(setImage);
    }, [settings]);

    function calcItemStyle(option: string) {
      let style = settings.cardBorderProperty.calcCss();
      if (highlight && store.selection === option) {
        style = { ...selectionStyle, ...style };
      } else {
        if (image) {
          style.backgroundSize = "cover";
          style.backgroundImage = `url(${image})`;
        }
      }
      log.debug({ style }, "calculated style for slide item");
      return style;
    }

    const borderStyle = settings.widgetBorderProperty.calcCss();

    return (
      <>
        {titleFont.createFontImport()}
        <div className={`glide hidden`} ref={glideRef} style={borderStyle}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides" style={slideStyle}>
              {store.options.map((option) => (
                <div
                  key={option}
                  style={calcItemStyle(option)}
                  className={`${classes.reelitemcontainer} ${
                    highlight && store.selection === option
                      ? classes.active
                      : classes.notactive
                  }`}
                >
                  <li
                    key={option}
                    style={titleFont.calcStyle()}
                    className={`${titleFont.calcClassName()} glide__slide ${
                      classes.reelitem
                    }`}
                  >
                    {option}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  },
);
