import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { RouletteWidgetSettings } from "./RouletteWidgetSettings";
import RouletteWidget from "./RouletteWidget";

export default function RouletteWidgetPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as RouletteWidgetSettings;

  return (
    <WidgetWrapper>
      <RouletteWidget settings={widgetSettings} />
    </WidgetWrapper>
  );
}
