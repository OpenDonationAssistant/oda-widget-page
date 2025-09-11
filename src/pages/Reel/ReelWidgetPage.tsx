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
import { DefaultReelStore, ReelStore } from "../../stores/ReelStore";
import { useState } from "react";

export default function ReelWidgetPage({}) {
  const { settings, widgetId, conf } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(settings) as ReelWidgetSettings;

  const variablesStore = new DefaultVariableStore();

  const [reelStore] = useState<ReelStore>(
    () =>
      new DefaultReelStore({
        widgetId: widgetId,
        conf: conf,
        settings: widgetSettings,
      }),
  );

  return (
    <WidgetWrapper>
      <VariableStoreContext.Provider value={variablesStore}>
        <ReelWidget settings={widgetSettings} store={reelStore} />
      </VariableStoreContext.Provider>
    </WidgetWrapper>
  );
}
