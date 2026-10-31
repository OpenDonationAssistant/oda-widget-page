import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { HorizontalEventsWidget } from "./HorizontalEventsWidget";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";
import { DefaultHistoryStore, HistoryStore } from "../../stores/history";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function HorizontalEventsPage() {
  const { recipientId, widgetId, settings, conf } =
    useLoaderData() as WidgetData;
  const { accessToken } = useAuth();

  const [widgetSettings] = useState<HorizontalEventsWidgetSettings>(
    () =>
      Widget.configFromJson(settings) as HorizontalEventsWidgetSettings,
  );

  const [store] = useState<HistoryStore>(
    () =>
      new DefaultHistoryStore(
        accessToken ?? "",
        recipientId,
        widgetId,
        conf,
        widgetSettings.historyFilters.value,
      ),
  );

  return (
    <WidgetWrapper>
      <HorizontalEventsWidget settings={widgetSettings} store={store} />
    </WidgetWrapper>
  );
}
