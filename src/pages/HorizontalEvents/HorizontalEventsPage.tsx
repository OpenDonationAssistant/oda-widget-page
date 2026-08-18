import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { HorizontalEventsWidget } from "./HorizontalEventsWidget";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import { DefaultHistoryStore, HistoryStore } from "../History/HistoryStore";
import { useState } from "react";

export default function HorizontalEventsPage() {
  const { recipientId, widgetId, settings, conf } =
    useLoaderData() as WidgetData;

  const token = localStorage.getItem("access-token");
  if (!token) {
    throw new Error("Token not found");
  }

  const [store] = useState<HistoryStore>(
    () => new DefaultHistoryStore(token, recipientId, widgetId, conf),
  );

  return (
    <WidgetWrapper>
      <HorizontalEventsWidget
        settings={
          Widget.configFromJson(settings) as HorizontalEventsWidgetSettings
        }
        store={store}
      />
    </WidgetWrapper>
  );
}
