import { CSSProperties } from "react";
import { useEffect, useState } from "react";
import classes from "./DonationTimer.module.css";
import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { Flex } from "antd";
import { HistoryStore } from "../History/HistoryStore";
import { observer } from "mobx-react-lite";
import { reaction, toJS } from "mobx";
import { log } from "../../logging";
import { AlignmentRenderer } from "../../components/Renderer/AlignmentRenderer";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

export const DonationTimer = observer(
  ({
    settings,
    store,
  }: {
    settings: DonationTimerWidgetSettings;
    store: HistoryStore;
  }) => {
    const [lastDonationTime, setLastDonationTime] = useState<Date | null>(null);
    const [time, setTime] = useState<String>("");

    useEffect(() => {
      setLastDonationTime(new Date());
      if (!settings.resetOnLoad) {
        reaction(
          () => store.items.at(0),
          (item) => {
            log.debug({ item: toJS(item) }, "timer reaction");
            if (item?.timestamp) {
              const date = new Date(item?.timestamp);
              log.debug({ date: date }, "setting timer date");
              setLastDonationTime(date);
            }
          },
        );
      }
    }, [store, settings.resetOnLoad]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (!lastDonationTime) {
          return;
        }
        const now = Date.now();
        const difference = now - lastDonationTime.getTime();
        const days = Math.floor(difference / (24 * 36e5));
        const hours = Math.floor((difference % (24 * 36e5)) / 36e5);
        const minutes = Math.floor((difference % 36e5) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        setTime(
          `${days > 0 ? days + "D " : ""}${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
        );
      }, 1000);
      return () => clearInterval(intervalId);
    }, [lastDonationTime]);

    const text = settings.textProperty;

    const backgroundStyle = settings.backgroundColorProperty.calcCss();

    const borderStyle = settings.borderProperty.calcCss();

    const roundingStyle = settings.roundingProperty.calcCss();

    const paddingStyle = settings.paddingProperty.calcCss();

    const filterStyle = settings.blurProperty.calcCss();

    const boxShadowStyle = settings.boxShadowProperty.calcCss();

    const heightStyle: CSSProperties = {
      height: `calc(100% - ${2 * settings.boxShadowProperty.requiredHeight}px)`,
      marginTop: `${settings.boxShadowProperty.requiredHeight}px`,
    };

    const widthStyle: CSSProperties = {
      width: `calc(100% - ${2 * settings.boxShadowProperty.requiredWidth}px)`,
      marginLeft: `${settings.boxShadowProperty.requiredWidth}px`,
    };

    return (
      <>
        {settings.titleFontProperty.createFontImport()}
        {time && (
          <Flex
            align="center"
            justify="flex-start"
            id="donationTimer"
            style={{
              ...paddingStyle,
              ...borderStyle,
              ...roundingStyle,
              ...boxShadowStyle,
              ...heightStyle,
              ...widthStyle,
            }}
            className={`${classes.timer}`}
          >
            <div
              style={{
                ...backgroundStyle,
                ...filterStyle,
                ...roundingStyle,
              }}
              className={`${classes.background}`}
            />
            <AlignmentRenderer alignment={settings.textAlign}>
              <TextRenderer
                font={settings.titleFontProperty}
                text={text.replace("<time>", `${time}`)}
              />
            </AlignmentRenderer>
          </Flex>
        )}
      </>
    );
  },
);
