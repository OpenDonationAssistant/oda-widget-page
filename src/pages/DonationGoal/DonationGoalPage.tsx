import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { DonationGoal } from "../../components/DonationGoal/DonationGoal";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { DonationGoalState } from "../../components/DonationGoal/DonationGoalState";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";

export default function DonatonPage({}) {
  const { widgetId, conf, recipientId, settings } =
    useLoaderData() as WidgetData;

  const donationGoalSettings = Widget.configFromJson(
    settings,
  ) as DonationGoalWidgetSettings;

  return (
    <>
      <WidgetWrapper>
        <DonationGoal
          settings={donationGoalSettings}
          state={
            new DonationGoalState({
              widgetId: widgetId,
              conf: conf,
              paymentPageConfig: new PaymentPageConfig(recipientId),
            })
          }
        />
      </WidgetWrapper>
    </>
  );
}
