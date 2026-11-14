import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { StreamCreditsWidgetSettings } from "./StreamCreditsWidgetSettings";
import { useEffect, useRef, useState } from "react";
import { StreamCreditsStore } from "./StreamCreditsStore";
import { Flex } from "antd";
import classes from "./StreamCreditsWidget.module.css";

export const StreamCreditsWidget = observer(
  ({
    settings,
    creditsStore,
  }: {
    settings: StreamCreditsWidgetSettings;
    creditsStore: StreamCreditsStore;
  }) => {
    const { t } = useTranslation();
    const [show, setShow] = useState<boolean>(true);
    const [height, setHeight] = useState(0);
    const [duration, setDuration] = useState<number>(10000);
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!container.current) return;
      // initial measurement
      setHeight(container.current.getBoundingClientRect().height);

      // optional: update on resize or content changes
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const h = entry.contentRect.height;
          setHeight(h);
        }
      });
      ro.observe(container.current);
      return () => ro.disconnect();
    }, [container]);

    useEffect(() => {
      if (height === 0) return;
      if (settings.speedProperty.value === 0) return;
      const duration = height / settings.speedProperty.value;
      setDuration(duration);
    }, [height]);

    const creditFontStyle = settings.creditsFontProperty.calcStyle();
    const titleFontStyle = settings.titleFontProperty.calcStyle();

    return (
      <>
        {settings.titleFontProperty.createFontImport()}
        {settings.creditsFontProperty.createFontImport()}
        {show && (
          <Flex vertical className={`${classes.marquee}`}>
            <Flex
              ref={container}
              vertical
              className={`${classes.marqueeinner}`}
              style={{
                animationDuration: `${duration}s`,
              }}
            >
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-voters-title")}
                </div>
                <div style={titleFontStyle}>
                  {t("stream-credits-voters-subtitle")}
                </div>
                {creditsStore.voters.length === 0 && (
                  <div style={creditFontStyle}>{t("stream-credits-empty")}</div>
                )}
                {creditsStore.voters.map((name, index) => (
                  <div key={index} style={creditFontStyle}>
                    {name}
                  </div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-followers-title")}
                </div>
                <div style={titleFontStyle}>
                  {t("stream-credits-followers-subtitle")}
                </div>
                {creditsStore.newFollowers.length === 0 && (
                  <div style={creditFontStyle}>{t("stream-credits-empty")}</div>
                )}
                {creditsStore.newFollowers.map((name, index) => (
                  <div key={index} style={creditFontStyle}>
                    {name}
                  </div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-raiders-title")}
                </div>
                <div style={titleFontStyle}>
                  {t("stream-credits-raiders-subtitle")}
                </div>
                {creditsStore.raiders.length === 0 && (
                  <div style={creditFontStyle}>{t("stream-credits-empty")}</div>
                )}
                {creditsStore.raiders.map((name, index) => (
                  <div key={index} style={creditFontStyle}>
                    {name}
                  </div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-gifters-title")}
                </div>
                <div style={titleFontStyle}>
                  {t("stream-credits-gifters-subtitle")}
                </div>
                {creditsStore.gifters.length === 0 && (
                  <div style={creditFontStyle}>{t("stream-credits-empty")}</div>
                )}
                {creditsStore.gifters.map((name, index) => (
                  <div key={index} style={creditFontStyle}>
                    {name}
                  </div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-donaters-title")}
                </div>
                <div style={titleFontStyle}>
                  {t("stream-credits-donaters-subtitle")}
                </div>
                {creditsStore.donaters.length === 0 && (
                  <div style={creditFontStyle}>{t("stream-credits-empty")}</div>
                )}
                {creditsStore.donaters.map((name, index) => (
                  <div key={index} style={creditFontStyle}>
                    {name}
                  </div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  {t("stream-credits-thanks")}
                </div>
              </Flex>
            </Flex>
          </Flex>
        )}
      </>
    );
  },
);
