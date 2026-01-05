import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { RouletteWidgetSettings } from "./RouletteWidgetSettings";
import { ElementsWidget } from "../../components/Element/ElementsWidget";

export default function RouletteWidgetPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as RouletteWidgetSettings;

  return (
    <WidgetWrapper>
      <ElementsWidget settings={widgetSettings} />
    </WidgetWrapper>
  );
}
