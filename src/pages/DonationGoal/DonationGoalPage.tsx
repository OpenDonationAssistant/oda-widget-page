import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { DonationGoal } from "../../components/DonationGoal/DonationGoal";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { DonationGoalState } from "../../components/DonationGoal/DonationGoalState";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { DefaultVariableStore, VariableStoreContext } from "../../stores/VariableStore";

export default function DonatonPage({}) {
  const { widgetId, conf, recipientId, settings } =
    useLoaderData() as WidgetData;

  const donationGoalSettings = Widget.configFromJson(
    settings,
  ) as DonationGoalWidgetSettings;

  const state = new DonationGoalState({
    widgetId: widgetId,
    conf: conf,
    paymentPageConfig: new PaymentPageConfig(recipientId),
  });

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={new DefaultVariableStore()}>
        <DonationGoal settings={donationGoalSettings} state={state} />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
