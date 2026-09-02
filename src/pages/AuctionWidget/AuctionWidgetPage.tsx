import { useState } from "react";
import { useLoaderData } from "react-router";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import { WidgetData } from "../../types/WidgetData";
import { AuctionWidget } from "./AuctionWidget";
import { AuctionWidgetSettings } from "./AuctionWidgetSettings";
import { AuctionWidgetDemoStore } from "./AuctionWidgetDemoStore";

export default function AuctionWidgetPage() {
  const { settings, widgetId, conf } = useLoaderData() as WidgetData;
  const widgetSettings = Widget.configFromJson(
    settings,
  ) as AuctionWidgetSettings;
  // const [store] = useState(() => new DefaultAuctionWidgetStore(widgetId, conf));
  const [store] = useState(() => new AuctionWidgetDemoStore(widgetId, conf));

  return (
    <WidgetWrapper>
      <AuctionWidget settings={widgetSettings} store={store} />
    </WidgetWrapper>
  );
}
