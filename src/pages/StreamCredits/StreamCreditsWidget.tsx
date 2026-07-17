import { observer } from "mobx-react-lite";
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
                  Танцующие на столе (участники квиза)
                </div>
                {creditsStore.voters.length === 0 && (
                  <div style={creditFontStyle}>Такие отсутствуют</div>
                )}
                {creditsStore.voters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  Новые посетители таверны (фоллоу)
                </div>
                {creditsStore.newFollowers.length === 0 && (
                  <div style={creditFontStyle}>Такие отсутствуют</div>
                )}
                {creditsStore.newFollowers.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  Пришли в своей компании (рейдеры)
                </div>
                {creditsStore.raiders.length === 0 && (
                  <div style={creditFontStyle}>Такие отсутствуют</div>
                )}
                {creditsStore.raiders.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  Угостили лисят в баре (подарочные подписки)
                </div>
                {creditsStore.gifters.length === 0 && (
                  <div style={creditFontStyle}>Такие отсутствуют</div>
                )}
                {creditsStore.gifters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>
                  Подкинули бармену на отпуск (донатеры)
                </div>
                {creditsStore.donaters.length === 0 && (
                  <div style={creditFontStyle}>Такие отсутствуют</div>
                )}
                {creditsStore.donaters.map((name) => (
                  <div style={creditFontStyle}>{name}</div>
                ))}
              </Flex>
              <Flex vertical align="center">
                <div style={titleFontStyle}>Спасибо за внимание!</div>
              </Flex>
            </Flex>
          </Flex>
        )}
      </>
    );
  },
);
