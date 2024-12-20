import { CSSProperties, useContext, useEffect } from "react";
import "videojs-youtube";
import { PlayerPopupWidgetSettingsContext } from "../ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import { AbstractPlayerStore } from "./Player";
import { observer } from "mobx-react-lite";

const PlayerPopup = observer(({ player }: { player: AbstractPlayerStore }) => {
  const settings = useContext(PlayerPopupWidgetSettingsContext);

  useEffect(() => {
    const vol = JSON.parse(localStorage.getItem("volume") ?? "50");
    player.volume = vol / 100;
  }, [player]);

  const borderStyle = settings.widgetBorderProperty.calcCss();
  const roundingStyle = settings.roundingProperty.calcCss();
  const shadowProperty = settings.shadowProperty;
  const widgetStyle: CSSProperties = settings.audioOnlyProperty.value
    ? { visibility: "hidden", height: "1px" }
    : borderStyle;
  const heightStyle = `calc(100% - ${2 * shadowProperty.requiredHeight}px)`;
  const widthStyle = `calc(100% - ${2 * shadowProperty.requiredWidth}px)`;

  const borderCss = (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          iframe {
            height: ${heightStyle}!important;
            width: ${widthStyle}!important;
            margin-top: ${shadowProperty.requiredHeight}px;
            margin-left: ${shadowProperty.requiredWidth}px;
            box-shadow: ${shadowProperty.calcCss().boxShadow};
            border-top: ${widgetStyle.borderTop};
            border-bottom: ${widgetStyle.borderBottom};
            border-right: ${widgetStyle.borderRight};
            border-left: ${widgetStyle.borderLeft};
            border-top-left-radius: ${roundingStyle.borderTopLeftRadius};
            border-top-right-radius: ${roundingStyle.borderTopRightRadius};
            border-bottom-right-radius: ${
              roundingStyle.borderBottomRightRadius
            };
            border-bottom-left-radius: ${roundingStyle.borderBottomLeftRadius};
          }`,
      }}
    />
  );

  return (
    <>
      {borderCss}
      <div id="mediaplayer" className="full-height vjs-big-play-centered" />
    </>
  );
});

export default PlayerPopup;
