import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import { CSSProperties, useEffect, useRef, useState } from "react";
import classes from "./ReelWidget.module.css";
import { log } from "../../logging";
import { ReelWidgetSettings } from "./ReelWidgetSettings";
import { ReelStore } from "../../stores/ReelStore";
import { observer } from "mobx-react-lite";
import { fullUri } from "../../utils";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

export const ReelWidget = observer(
  ({ settings, store }: { settings: ReelWidgetSettings; store: ReelStore }) => {
    const glideRef = useRef<HTMLDivElement | null>(null);
    const glide = useRef<Glide | null>(null);
    const [highlight, setHighlight] = useState<boolean>(false);
    const [winningStyle, setWinningStyle] = useState<CSSProperties>(() => {
      return {};
    });
    const [nonWinningStyle, setNonWinningStyle] = useState<CSSProperties>(
      () => {
        return {};
      },
    );

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
      const time = settings.timeProperty.value * 1000;
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

    const selectionStyle = settings.selectionColorProperty.calcCss();

    const slideStyle = {
      alignItems: "stretch",
    };

    useEffect(() => {
      let backgroundImage = settings.itemBackgroundProperty.value;
      fullUri(backgroundImage).then((image) => {
        let nonWinningStyle = settings.cardBorderProperty.calcCss();
        if (image) {
          nonWinningStyle.backgroundSize = "cover";
          nonWinningStyle.backgroundImage = `url(${image})`;
        }
        setNonWinningStyle(nonWinningStyle);
        let winningStyle = {
          ...selectionStyle,
          ...settings.cardBorderProperty.calcCss(),
        };
        setWinningStyle(winningStyle);
      });
    }, [settings]);

    const borderStyle = settings.widgetBorderProperty.calcCss();

    return (
      <div className={`glide hidden`} ref={glideRef} style={borderStyle}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides" style={slideStyle}>
            {store.options.map((option) => (
              <div
                key={option}
                style={
                  highlight && store.selection === option
                    ? winningStyle
                    : nonWinningStyle
                }
                className={`${classes.reelitemcontainer} ${
                  highlight && store.selection === option
                    ? classes.active
                    : classes.notactive
                }`}
              >
                <li key={option} className={`glide__slide ${classes.reelitem}`}>
                  <TextRenderer
                    text={option}
                    font={settings.titleFontProperty}
                  />
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);
