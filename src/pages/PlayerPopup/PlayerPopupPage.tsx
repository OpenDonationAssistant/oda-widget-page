import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import { PlayerPopupWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import PlayerPopup from "../../components/PlayerPopup/PlayerPopup";
import { PlayerStore } from "../../components/PlayerPopup/Player";

export default function PlayerPopupPage({}) {
  const { settings, conf, widgetId } = useLoaderData() as WidgetData;

  const player = new PlayerStore({ widgetId: widgetId, conf: conf.topic });

  return (
    <WidgetWrapper>
      <PlayerPopup
        player={player}
        settings={Widget.configFromJson(settings) as PlayerPopupWidgetSettings}
      />
    </WidgetWrapper>
  );
}
