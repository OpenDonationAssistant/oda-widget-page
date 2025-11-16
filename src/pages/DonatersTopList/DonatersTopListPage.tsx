import WidgetWrapper from "../../WidgetWrapper";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { DonatersTopList } from "./DonatersTopList";
import { DonatersTopListWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { DonatersListStore } from "./DonatersListStore";
import { DefaultHistoryStore } from "../History/HistoryStore";

export default function DonatersTopListPage() {
  const { widgetId, recipientId, settings, conf } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as DonatersTopListWidgetSettings;

  const store = new DonatersListStore(
    widgetId,
    recipientId,
    widgetSettings.period,
    widgetSettings.type,
    conf.topic.donaterstoplist,
  );

  const historyStore = new DefaultHistoryStore(recipientId, widgetId, conf);

  return (
    <WidgetWrapper>
      <DonatersTopList
        settings={widgetSettings}
        topListStore={store}
        historyStore={historyStore}
      />
    </WidgetWrapper>
  );
}
