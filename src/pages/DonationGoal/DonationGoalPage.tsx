import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { DonationGoal } from "./DonationGoal";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { DonationGoalState } from "./DonationGoalState";
import { useVariableStore } from "../../stores/VariableStore";

export default function DonatonPage() {
  const { widgetId, conf, settings } = useLoaderData() as WidgetData;

  const donationGoalSettings = Widget.configFromJson(
    settings,
  ) as DonationGoalWidgetSettings;

  const { variablesStore } = useVariableStore();

  const state = new DonationGoalState({
    widgetId: widgetId,
    settings: donationGoalSettings,
    topics: { goal: conf.topic.goal },
    variables: variablesStore,
  });

  return (
    <WidgetWrapper>
      <DonationGoal settings={donationGoalSettings} state={state} />
    </WidgetWrapper>
  );
}
