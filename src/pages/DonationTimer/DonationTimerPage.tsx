import React from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import DonationTimer from "./DonationTimer";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import {
  DonationTimerWidgetSettings,
  DonationTimerWidgetSettingsContext,
} from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";

export default function DonationTimerPage({}) {
  const { settings } = useLoaderData() as WidgetData;

  return (
    <>
      <DonationTimerWidgetSettingsContext.Provider
        value={Widget.configFromJson(settings) as DonationTimerWidgetSettings}
      >
        <WidgetWrapper>
          <DonationTimer />
        </WidgetWrapper>
      </DonationTimerWidgetSettingsContext.Provider>
    </>
  );
}
