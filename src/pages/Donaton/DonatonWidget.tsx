import { CSSProperties, useEffect, useState } from "react";
import { log } from "../../logging";
import classes from "./DonatonWidget.module.css";
import { DonatonWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import { observer } from "mobx-react-lite";

export const DonatonWidget = observer(
  ({ settings }: { settings: DonatonWidgetSettings }) => {
    const [time, setTime] = useState<String>("");
    const [style, setStyle] = useState<CSSProperties>({});

    // TODO: or ahooks?
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (!settings.timerEndProperty.timestamp) {
          return;
        }
        log.debug({ endTime: settings.timerEndProperty.timestamp });
        const now = Date.now();
        const end = Date.parse(`${settings.timerEndProperty.timestamp}`);
        const difference = end - now;
        if (difference < 0) {
          setTime("00:00:00");
          return;
        }
        log.debug({ now: now, end: end, diff: difference });
        const hours = Math.floor(difference / 36e5);
        const minutes = Math.floor((difference % 36e5) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        setTime(
          `${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
        );
      }, 1000);
      return () => clearInterval(intervalId);
    }, [settings]);

    const titleFont = settings.titleFontProperty;

    useEffect(() => {
      settings.backgroundImageProperty.calcCss().then((css) => {
        log.debug({ css: css }, "setting style");
        setStyle({
          ...settings.borderProperty.calcCss(),
          ...settings.backgroundColorProperty.calcCss(),
          ...settings.paddingProperty.calcCss(),
          ...settings.roundingProperty.calcCss(),
          ...settings.shadowProperty.calcCss(),
          ...css,
        });
      });
    }, [
      settings.backgroundImageProperty.value,
      settings.borderProperty.value,
      settings.paddingProperty.value,
      settings.roundingProperty.value,
      settings.shadowProperty.value,
    ]);

    return (
      <>
        {titleFont.createFontImport()}
        <div
          id="donatonTimer"
          className={`${classes.textholder}`}
          style={style}
        >
          <div
            style={titleFont.calcStyle()}
            className={`${titleFont.calcClassName()}`}
          >
            {settings.textProperty.replace("<time>", `${time}`)}
          </div>
        </div>
      </>
    );
  },
);
