import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import {
  DefaultVariableStore,
  VariableStoreContext,
} from "../../stores/VariableStore";
import { ReelWidgetSettings } from "./ReelWidgetSettings";
import ReelWidget from "./ReelWidget";

export default function ReelWidgetPage({}) {
  const { widgetId, conf, recipientId, settings } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as ReelWidgetSettings;

  const variablesStore = new DefaultVariableStore()

  // const state = new DonationGoalState({
  //   widgetId: widgetId,
  //   conf: conf,
  //   paymentPageConfig: new PaymentPageConfig(recipientId),
  //   variables: variablesStore
  // });

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={variablesStore}>
        <ReelWidget />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
