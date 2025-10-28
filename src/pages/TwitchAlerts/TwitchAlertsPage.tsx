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

export default function TwitchAlertsPage({}) {
  const { widgetId, conf, recipientId, settings } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as TwitchAlertsWidgetSettings;

  const variablesStore = new DefaultVariableStore();

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={variablesStore}>
        <TwitchAlertsWidget settings={widgetSettings} />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
