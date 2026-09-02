import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { DonationTimer } from "./DonationTimer";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { useState } from "react";
import { DefaultHistoryStore, HistoryStore } from "../History/HistoryStore";
import { useAuth } from "../../contexts/AuthContext";

export default function DonationTimerPage() {
  const { settings, recipientId, conf, widgetId } =
    useLoaderData() as WidgetData;
  const { accessToken } = useAuth();

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as DonationTimerWidgetSettings;

  const [store] = useState<HistoryStore>(
    () =>
      new DefaultHistoryStore(accessToken ?? "", recipientId, widgetId, conf),
  );

  return (
    <WidgetWrapper>
      <DonationTimer settings={widgetSettings} store={store} />
    </WidgetWrapper>
  );
}
