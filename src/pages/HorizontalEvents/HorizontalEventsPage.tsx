import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import HorizontalEventsWidget from "./HorizontalEventsWidget";
import { HorizontalEventsWidgetSettings } from "./HorizontalEventsWidgetSettings";

export default function HorizontalEventsPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <WidgetWrapper>
      <HorizontalEventsWidget
        settings={
          Widget.configFromJson(settings) as HorizontalEventsWidgetSettings
        }
      />
    </WidgetWrapper>
  );
}
