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

  const token = localStorage.getItem("access-token");
  if (!token) {
    // TODO relogin
    throw new Error("Access token not found");
  }

  const historyStore = new DefaultHistoryStore(
    token,
    recipientId,
    widgetId,
    conf,
    {
      showODA: true,
      showDonationAlerts: true,
      showDonatePay: true,
      showDonatePayEu: true,
      showDonateStream: true,
      showDonateX: true,
      showTribute: true,
      showBoostySubs: false,
      showBoostyFollows: false,
      showMemeAlertsCoins: false,
      showTwitchFollows: false,
      showTwitchRaids: false,
      showTwitchCheers: false,
      showTwitchSubs: false,
      showTwitchSubGifts: false,
      showKickFollows: false,
      showKickGifts: false,
      showKickSubs: false,
      showKickSubGifts: false,
      showVKLiveFollows: false,
      showVKLiveSubs: false,
    },
  );

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
