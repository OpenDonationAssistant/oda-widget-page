import React from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import WidgetWrapper from "../../WidgetWrapper";
import { Widget } from "../../types/Widget";
import {
  PlayerPopupWidgetSettings,
  PlayerPopupWidgetSettingsContext,
} from "../../components/ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import PlayerPopup from "../../components/PlayerPopup/PlayerPopup";
import { PlayerStore } from "../../components/PlayerPopup/Player";

export default function PlayerPopupPage({}) {
  const { settings, conf, widgetId } = useLoaderData() as WidgetData;

  const player = new PlayerStore({ widgetId: widgetId, conf: conf.topic });

  return (
    <>
      <PlayerPopupWidgetSettingsContext.Provider
        value={Widget.configFromJson(settings) as PlayerPopupWidgetSettings}
      >
        <WidgetWrapper>
          <PlayerPopup player={player} />
        </WidgetWrapper>
      </PlayerPopupWidgetSettingsContext.Provider>
    </>
  );
}
