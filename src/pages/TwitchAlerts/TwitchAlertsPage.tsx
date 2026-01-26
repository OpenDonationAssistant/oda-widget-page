import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { TwitchAlertsWidgetSettings } from "./TwitchAlertsWidgetSettings";
import {
  DefaultVariableStore,
  VariableStoreContext,
} from "../../stores/VariableStore";
import WidgetWrapper from "../../WidgetWrapper";
import { TwitchAlertsWidget } from "./TwitchAlertsWidget";
import { DefaultTwitchAlertsStore } from "../../stores/alerts/TwitchAlertsStore";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { uuidv7 } from "uuidv7";

export default function TwitchAlertsPage() {
  const { conf, widgetId, recipientId, settings } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as TwitchAlertsWidgetSettings;

  const pageConfig = new PaymentPageConfig(recipientId);
  const variablesStore = new DefaultVariableStore();
  variablesStore.addVariable({
    id: uuidv7(),
    name: "streamer",
    value: pageConfig.displayName,
    tags: ["page"],
    type: "string",
  });
  const store = new DefaultTwitchAlertsStore(
    widgetId,
    widgetSettings,
    conf,
    variablesStore,
  );

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={variablesStore}>
        <TwitchAlertsWidget store={store} />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
