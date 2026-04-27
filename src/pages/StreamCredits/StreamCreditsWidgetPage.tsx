import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { StreamCreditsWidgetSettings } from "./StreamCreditsWidgetSettings";
import { StreamCreditsWidget } from "./StreamCreditsWidget";
import { StreamCreditsStore } from "./StreamCreditsStore";
import { DefaultEventBus } from "../../bus/EventBus";

export default function StreamCreditsWidgetPage({}) {
  const { recipientId, widgetId, conf } = useLoaderData() as WidgetData;
  const { settings } = useLoaderData() as WidgetData;

  const eventBus = new DefaultEventBus(widgetId, conf.topic.events);

  const creditsStore = new StreamCreditsStore(eventBus);

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as StreamCreditsWidgetSettings;

  return (
    <WidgetWrapper>
      <StreamCreditsWidget
        settings={widgetSettings}
        creditsStore={creditsStore}
      />
    </WidgetWrapper>
  );
}
