import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import {
  DefaultVariableStore,
  VariableStoreContext,
} from "../../stores/VariableStore";
import { ReelWidgetSettings } from "./ReelWidgetSettings";
import { ReelWidget } from "./ReelWidget";
import { DefaultReelStore } from "../../stores/ReelStore";

export default function ReelWidgetPage({}) {
  const { widgetId, conf, settings } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(settings) as ReelWidgetSettings;

  const variablesStore = new DefaultVariableStore();

  const reelStore = new DefaultReelStore({
    widgetId: widgetId,
    conf: conf,
    settings: widgetSettings,
  });

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={variablesStore}>
        <ReelWidget settings={widgetSettings} store={reelStore} />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
