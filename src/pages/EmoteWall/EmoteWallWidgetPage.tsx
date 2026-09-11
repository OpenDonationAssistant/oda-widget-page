import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { EmoteWallWidgetSettings } from "./EmoteWallWidgetSettings";
import { EmoteWallWidget } from "./EmoteWallWidget";
import {
  DefaultEmoteWallWidgetStore,
  EmoteWallWidgetStore,
} from "./EmoteWallWidgetStore";
import { useState } from "react";

export default function EmoteWallWidgetPage() {
  const { settings, widgetId, conf } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as EmoteWallWidgetSettings;

  const [store] = useState<EmoteWallWidgetStore>(
    () =>
      new DefaultEmoteWallWidgetStore({
        maxConcurrentEmotes: widgetSettings.maxConcurrentEmotesProperty.value,
        animationDuration: widgetSettings.animationDurationProperty.value,
      }),
  );

  return (
    <WidgetWrapper>
      <EmoteWallWidget settings={widgetSettings} store={store} />
    </WidgetWrapper>
  );
}