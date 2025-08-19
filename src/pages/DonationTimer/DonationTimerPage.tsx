import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { DonationTimer } from "./DonationTimer";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";

export default function DonationTimerPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as DonationTimerWidgetSettings;

  return (
    <WidgetWrapper>
      <DonationTimer settings={widgetSettings} />
    </WidgetWrapper>
  );
}
