import { useContext, useEffect, useState } from "react";
import { log } from "../../logging";
import classes from "./DonatonWidget.module.css";
import { DonatonWidgetSettingsContext } from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";

export default function DonatonWidget({}) {
  const settings = useContext(DonatonWidgetSettingsContext);
  const [time, setTime] = useState<String>("");

  // TODO: or ahooks?
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!settings.timerEndProperty.timestamp) {
        return;
      }
      console.log(settings.timerEndProperty.timestamp);
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

  const style = {
    ...titleFont.calcStyle(),
    ...settings.borderProperty.calcCss(),
    ...settings.backgroundColorProperty.calcCss(),
    ...settings.paddingProperty.calcCss(),
    ...settings.roundingProperty.calcCss(),
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: rgba(0,0,0,0);}`,
        }}
      />
      {titleFont.createFontImport()}
      <div id="donatonTimer" className={`${classes.textholder}`} style={style}>
        <div className={`${titleFont.calcClassName()}`}>
          {settings.textProperty.replace("<time>", `${time}`)}
        </div>
      </div>
    </>
  );
}
