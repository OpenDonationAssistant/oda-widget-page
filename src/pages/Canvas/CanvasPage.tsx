import WidgetWrapper from "../../WidgetWrapper";
import { ElementsWidget } from "../../components/Element/ElementsWidget";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { CanvasWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/canvas/CanvasWidgetSettings";

export default function CanvasPage() {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <WidgetWrapper>
      <ElementsWidget
        settings={Widget.configFromJson(settings) as CanvasWidgetSettings}
      />
    </WidgetWrapper>
  );
}
