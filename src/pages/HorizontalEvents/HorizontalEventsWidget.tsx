import { useEffect, useRef, useState } from "react";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import Marquee from "react-fast-marquee";
import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { HistoryStore, matchesHistoryFilters } from "../../stores/history";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

// The history service filters systems and events independently, so a mixed
// selection can return rows that the client-side filter hides. Keep loading
// bounded extra pages until enough matching events are collected for the feed.
const targetEvents = 10;
const maxExtraPages = 10;

export const HorizontalEventsWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: HorizontalEventsWidgetSettings;
    store: HistoryStore;
  }) => {
    const now = new Date();
    const filters = settings.historyFilters.value;
    const events = store.items.filter((it) =>
      matchesHistoryFilters(it, filters, now),
    );

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadingMore = useRef(false);
    const extraPagesLoaded = useRef(0);
    const failed = useRef(false);

    // `store.items` is a dependency so the effect retries even when a page
    // adds only filtered-out rows and `events.length` does not change.
    // TODO simplify history loading
    useEffect(() => {
      if (
        loadingMore.current ||
        failed.current ||
        events.length >= targetEvents ||
        extraPagesLoaded.current >= maxExtraPages ||
        !store.hasNext()
      ) {
        return;
      }

      loadingMore.current = true;
      setIsLoadingMore(true);
      store
        .next()
        .catch(() => {
          // HistoryStore already logs the error; stop paging on failure.
          failed.current = true;
        })
        .finally(() => {
          extraPagesLoaded.current += 1;
          loadingMore.current = false;
          setIsLoadingMore(false);
        });
    }, [events.length, isLoadingMore, store, filters, store.items]);

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
              font={settings.headerFont}
            />
          </div>
        )}
        <Marquee speed={settings.speed.value}>
          {events.map((it) => (
            <Flex
              key={it.id}
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
                font={settings.eventsNicknameFont}
              />{" "}
              {settings.showAmount.value && (
                <TextRenderer
                  text={`- ${it.amount?.major}RUB`}
                  font={settings.eventsAmountFont}
                />
              )}
              {settings.showMessage.value && (
                <TextRenderer
                  text={it.message ? ` - ${it.message}` : ""}
                  font={settings.eventsMessageFont}
                />
              )}
            </Flex>
          ))}
        </Marquee>
      </Flex>
    );
  },
);
