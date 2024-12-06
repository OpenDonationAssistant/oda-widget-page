import { useRef, CSSProperties, useContext, useState, useEffect } from "react";
import "videojs-youtube";
import { PlayerPopupWidgetSettingsContext } from "../ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import { Player } from "./Player";
import { log } from "../../logging";

export default function PlayerPopup({ player }: { player: Player }) {
  const videoRef = useRef(null);

  const [volume, setVolume] = useState<number>(() => {
    const vol = localStorage.getItem("volume");
    log.debug({volume: vol}, "volume from local storage");
    if (vol) {
      return JSON.parse(vol) / 100;
    }
    return 0.5;
  });

  useEffect(() => {
    player.volume = volume;
  },[volume]);

  player.videoRef = videoRef;

  const settings = useContext(PlayerPopupWidgetSettingsContext);
  const borderStyle = settings.widgetBorderProperty.calcCss();
  const roundingStyle = settings.roundingProperty.calcCss();
  const widgetStyle: CSSProperties = settings.audioOnlyProperty.value
    ? { visibility: "hidden", height: "1px" }
    : borderStyle;

  const borderCss = (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          iframe {
            border: ${widgetStyle.border};
            border-top: ${widgetStyle.borderTop};
            border-bottom: ${widgetStyle.borderBottom};
            border-right: ${widgetStyle.borderRight};
            border-left: ${widgetStyle.borderLeft};
            border-top-left-radius: ${roundingStyle.borderTopLeftRadius};
            border-top-right-radius: ${roundingStyle.borderTopRightRadius};
            border-bottom-right-radius: ${roundingStyle.borderBottomRightRadius};
            border-bottom-left-radius: ${roundingStyle.borderBottomLeftRadius};
          }`,
      }}
    />
  );

  return (
    <>
      {borderCss}
      <div className="video-player">
        <div ref={videoRef} />
      </div>
    </>
  );
}
