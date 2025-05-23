import { useEffect, useState } from "react";
import classes from "./HorizontalEventsWidget.module.css";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import Marquee from "react-fast-marquee";
import { subscribe, unsubscribe } from "../../socket";
import {
  HistoryItemData,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { log } from "../../logging";
import { Flex } from "antd";

const dayDateDiff = 1000 * 60 * 60 * 24;

async function getHistory(
  recipientId: string,
): Promise<{ total: number; list: HistoryItemData[] }> {
  const history = await HistoryService(
    undefined,
    process.env.REACT_APP_HISTORY_API_ENDPOINT,
  ).getHistory(
    {
      recipientId: recipientId,
    },
    { params: { size: 20, page: 0 } },
  );
  return { total: history.data.totalSize, list: history.data?.content };
}

export default function HorizontalEventsWidget({
  settings,
}: {
  settings: HorizontalEventsWidgetSettings;
}) {
  const { recipientId, conf, widgetId } = useLoaderData() as WidgetData;

  const [events, setEvents] = useState<HistoryItemData[]>([]);

  const updatePayments = () => {
    const now = new Date();
    getHistory(recipientId).then((data) =>
      setEvents(
        data.list.filter((it) => {
          if (it.authorizationTimestamp) {
            const paymentDate = new Date(it.authorizationTimestamp);
            return now.getTime() - paymentDate.getTime() < dayDateDiff;
          }
          return false;
        }),
      ),
    );
  };

  // TODO: or ahooks?
  useEffect(() => {
    updatePayments();
    subscribe(widgetId, conf.topic.alerts, (message) => {
      log.debug(`horizontal events widgets received: ${message.body}`);
      setTimeout(() => updatePayments(), 3000);
      message.ack();
    });
    return () => {
      unsubscribe(widgetId, conf.topic.alerts);
    };
  }, [settings]);

  const headerFont = settings.headerFont;
  const eventsAmountFont = settings.eventsAmountFont;
  const eventsNicknameFont = settings.eventsNicknameFont;
  const eventsMessageFont = settings.eventsMessageFont;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: rgba(0,0,0,0);}`,
        }}
      />
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
        <Marquee>
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
              -{" "}
              <span
                style={eventsAmountFont?.calcStyle()}
                className={`${eventsAmountFont.calcClassName()}`}
              >
                {it.amount?.major}RUB
              </span>
              <span
                style={eventsMessageFont?.calcStyle()}
                className={`${eventsMessageFont.calcClassName()}`}
              >
                {it.message ? ` - ${it.message}` : ""}
              </span>
            </span>
          ))}
        </Marquee>
      </Flex>
    </>
  );
}
