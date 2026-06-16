import WidgetWrapper from "../../WidgetWrapper";
import { CanvasWidget } from "./CanvasWidget";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { CanvasWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/canvas/CanvasWidgetSettings";

export default function CanvasPage() {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <WidgetWrapper>
      <CanvasWidget
        settings={Widget.configFromJson(settings) as CanvasWidgetSettings}
      />
    </WidgetWrapper>
  );
}
