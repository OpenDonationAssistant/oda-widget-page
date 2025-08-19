import { useEffect, useState } from "react";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import Marquee from "react-fast-marquee";
import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { HistoryStore } from "../History/HistoryStore";
import { HistoryItemData } from "@opendonationassistant/oda-history-service-client";

const dayDateDiff = 1000 * 60 * 60 * 24;

export const HorizontalEventsWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: HorizontalEventsWidgetSettings;
    store: HistoryStore;
  }) => {
    const [events, setEvents] = useState<HistoryItemData[]>([]);

    useEffect(() => {
      const now = new Date();
      setEvents(
        store.items.filter((it) => {
          const paymentDate = new Date(it.timestamp);
          return now.getTime() - paymentDate.getTime() < dayDateDiff;
        }),
      );
    }, [store.items]);

    const headerFont = settings.headerFont;
    const eventsAmountFont = settings.eventsAmountFont;
    const eventsNicknameFont = settings.eventsNicknameFont;
    const eventsMessageFont = settings.eventsMessageFont;

    return (
      <>
        {headerFont.createFontImport()}
        {eventsAmountFont.createFontImport()}
        {eventsMessageFont.createFontImport()}
        {eventsNicknameFont.createFontImport()}
        <Flex
          style={{
            ...settings.lineBorder.calcCss(),
            ...settings.lineBackgroundColor.calcCss(),
            ...settings.linePadding.calcCss(),
            ...settings.lineRounding.calcCss(),
          }}
        >
          {settings.showHeader.value && (
            <div
              style={{
                ...settings.headerBackgroundColor.calcCss(),
                ...settings.headerPadding.calcCss(),
                ...settings.headerBorder.calcCss(),
                ...settings.headerRounding.calcCss(),
                ...{ flexGrow: "1" },
              }}
            >
              <span
                style={headerFont?.calcStyle()}
                className={`${headerFont.calcClassName()}`}
              >
                {settings.headerText.value}
              </span>
            </div>
          )}
          <Marquee speed={settings.speed.value}>
            {events.map((it) => (
              <span
                style={{
                  ...settings.eventsBorder.calcCss(),
                  ...settings.eventsBackgroundColor.calcCss(),
                  ...settings.eventsPadding.calcCss(),
                  ...settings.eventsRounding.calcCss(),
                  ...{ marginRight: `${settings.eventGap.value}px` },
                }}
              >
                <span
                  style={eventsNicknameFont?.calcStyle()}
                  className={`${eventsNicknameFont.calcClassName()}`}
                >
                  {it.nickname ?? "Аноним"}
                </span>{" "}
                {settings.showAmount.value && (
                  <span
                    style={eventsAmountFont?.calcStyle()}
                    className={`${eventsAmountFont.calcClassName()}`}
                  >
                    - {it.amount?.major}RUB
                  </span>
                )}
                {settings.showMessage.value && (
                  <span
                    style={eventsMessageFont?.calcStyle()}
                    className={`${eventsMessageFont.calcClassName()}`}
                  >
                    {it.message ? ` - ${it.message}` : ""}
                  </span>
                )}
              </span>
            ))}
          </Marquee>
        </Flex>
      </>
    );
  },
);
