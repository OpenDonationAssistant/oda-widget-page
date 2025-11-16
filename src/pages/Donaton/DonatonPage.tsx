import WidgetWrapper from "../../WidgetWrapper";
import { DonatonWidget } from "./DonatonWidget";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { DonatonWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";

export default function DonatonPage() {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <WidgetWrapper>
      <DonatonWidget
        settings={Widget.configFromJson(settings) as DonatonWidgetSettings}
      />
    </WidgetWrapper>
  );
}
