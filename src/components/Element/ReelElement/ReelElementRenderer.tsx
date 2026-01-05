import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import { observer } from "mobx-react-lite";
import { ReelElementSettings } from "./ReelElement";
import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { ReelStoreContext } from "../../../stores/ReelStore";
import { log } from "../../../logging";
import { fullUri } from "../../../utils";
import { TextRenderer } from "../../Renderer/TextRenderer";
import classes from "./ReelElementRenderer.module.css";
import {
  Border,
  BorderPropertyValue,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";

function createBorderRule(border: Border) {
  return `${border.width}px ${border.type} ${border.color}`;
}

function calcBorder(value: BorderPropertyValue): CSSProperties {
  const style: CSSProperties = {};
  style.borderTop = "none";
  style.borderRight = "none";
  style.borderLeft = "none";
  style.borderBottom = "none";
  if (value.isSame === true) {
    const rule = createBorderRule(value.top);
    style.borderTop = rule;
    style.borderRight = rule;
    style.borderLeft = rule;
    style.borderBottom = rule;
  }
  if (value.isSame === false) {
    style.borderTop = createBorderRule(value.top);
    style.borderRight = createBorderRule(value.right);
    style.borderLeft = createBorderRule(value.left);
    style.borderBottom = createBorderRule(value.bottom);
  }
  return style;
}

export const ReelElementRenderer = observer(
  ({ settings }: { settings: ReelElementSettings }) => {
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
    const store = useContext(ReelStoreContext);

    useEffect(() => {
      if (!store) {
        return () => {};
      }

      if (!glideRef || !store.options) {
        return () => {};
      }

      const instance = new Glide(".glide", {
        type: "carousel",
        perView: settings.perView,
        rewind: true,
        animationDuration: settings.speed,
        focusAt: "center",
      }).mount();
      glide.current = instance;
      return () => instance.destroy();
    }, [glideRef, store?.options]);

    useEffect(() => {
      if (!store) {
        return;
      }
      if (!glideRef || !glideRef.current) {
        return;
      }
      if (!store.selection) {
        setHighlight(false);
        glideRef.current.classList.add("hidden");
        return;
      }
      glideRef.current.classList.remove("hidden");
      log.debug(`selecting ${store.selection} for reel`);
      const index = store.options.findIndex(
        (option) => option === store.selection,
      );
      log.debug({ options: store.options, index: index }, "highlight");
      const speed = settings.speed;
      const time = settings.time * 1000;
      glide.current?.update({ autoplay: speed });
      const timer = setTimeout(() => {
        const index = store.options.findIndex(
          (option) => option === store.selection,
        );
        log.debug({ options: store.options, index: index }, "highlight");
        glide.current?.update({ autoplay: false, startAt: index });
        setHighlight(true);
      }, time);
      return () => clearTimeout(timer);
    }, [store?.selection, glideRef]);

    const selectionStyle = settings.selectionColor;

    const slideStyle = {
      alignItems: "stretch",
    };

    useEffect(() => {
      let backgroundImage = settings.itemBackgroundImage.url;
      fullUri(backgroundImage).then((image) => {
        let nonWinningStyle = calcBorder(settings.cardBorder);
        if (image) {
          nonWinningStyle.backgroundSize = "cover";
          nonWinningStyle.backgroundImage = `url(${image})`;
        }
        setNonWinningStyle(nonWinningStyle);
        let winningStyle = {
          ...selectionStyle,
          ...calcBorder(settings.cardBorder),
        };
        setWinningStyle(winningStyle);
      });
    }, [settings]);

    if (!store) {
      return <></>;
    }

    return (
      <>
        <div className={`glide hidden`} ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides" style={slideStyle}>
              {store.options.map((option) => (
                <div
                  key={option}
                  className={`${classes.reelitemcontainer} ${
                    highlight && store.selection === option
                      ? classes.active
                      : classes.notactive
                  }`}
                >
                  <li
                    key={option}
                    className={`glide__slide ${classes.reelitem}`}
                    style={
                      highlight && store.selection === option
                        ? winningStyle
                        : nonWinningStyle
                    }
                  >
                    <TextRenderer text={option} font={settings.titleFont} />
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
