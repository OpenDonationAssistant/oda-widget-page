import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { DonationTimer } from "./DonationTimer";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { useState } from "react";
import { DefaultHistoryStore, HistoryStore } from "../History/HistoryStore";

export default function DonationTimerPage({}) {
  const { settings, recipientId, conf, widgetId } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as DonationTimerWidgetSettings;

  const [store] = useState<HistoryStore>(
    () => new DefaultHistoryStore(recipientId, widgetId, conf),
  );

  return (
    <WidgetWrapper>
      <DonationTimer settings={widgetSettings} store={store} />
    </WidgetWrapper>
  );
}
