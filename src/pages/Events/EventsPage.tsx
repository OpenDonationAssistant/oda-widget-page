import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import {
  DonatonWidgetSettings,
  DonatonWidgetSettingsContext,
} from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import Payments from "./Payments";

export default function EventsPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <>
      <DonatonWidgetSettingsContext.Provider
        value={Widget.configFromJson(settings) as DonatonWidgetSettings}
      >
        <WidgetWrapper>
          <Payments />
        </WidgetWrapper>
      </DonatonWidgetSettingsContext.Provider>
    </>
  );
}
