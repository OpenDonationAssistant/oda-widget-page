import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import {
  DonatonWidgetSettings,
  DonatonWidgetSettingsContext,
} from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import Payments from "./Payments";
import { PaymentsWidgetSettings, PaymentsWidgetSettingsContext } from "../../components/ConfigurationPage/widgetsettings/PaymentsWidgetSettings";

export default function EventsPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <>
      <PaymentsWidgetSettingsContext.Provider
        value={Widget.configFromJson(settings) as PaymentsWidgetSettings}
      >
        <WidgetWrapper>
          <Payments />
        </WidgetWrapper>
      </PaymentsWidgetSettingsContext.Provider>
    </>
  );
}
