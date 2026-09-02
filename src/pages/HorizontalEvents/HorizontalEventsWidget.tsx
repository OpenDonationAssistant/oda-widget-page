import { useEffect, useState } from "react";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import Marquee from "react-fast-marquee";
import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { HistoryItem, HistoryStore } from "../History/HistoryStore";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

const dayDateDiff = 1000 * 60 * 60 * 24;

export const HorizontalEventsWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: HorizontalEventsWidgetSettings;
    store: HistoryStore;
  }) => {
    const [events, setEvents] = useState<HistoryItem[]>([]);

    useEffect(() => {
      const now = new Date();
      setEvents(
        store.items.filter(
          (it) => now.getTime() - it.timestamp.getTime() < dayDateDiff,
        ),
      );
    }, [store.items]);

    return (
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
            <TextRenderer
              text={settings.headerText.value}
              font={settings.headerFont.value}
            />
          </div>
        )}
        <Marquee speed={settings.speed.value}>
          {events.map((it) => (
            <Flex
              style={{
                ...settings.eventsBorder.calcCss(),
                ...settings.eventsBackgroundColor.calcCss(),
                ...settings.eventsPadding.calcCss(),
                ...settings.eventsRounding.calcCss(),
                ...{ marginRight: `${settings.eventGap.value}px` },
                ...{ gap: `12px` },
              }}
            >
              <TextRenderer
                text={it.nickname ?? "Аноним"}
                font={settings.eventsNicknameFont.value}
              />{" "}
              {settings.showAmount.value && (
                <TextRenderer
                  text={`- ${it.amount?.major}RUB`}
                  font={settings.eventsAmountFont.value}
                />
              )}
              {settings.showMessage.value && (
                <TextRenderer
                  text={it.message ? ` - ${it.message}` : ""}
                  font={settings.eventsMessageFont.value}
                />
              )}
            </Flex>
          ))}
        </Marquee>
      </Flex>
    );
  },
);
