import { CSSProperties } from "react";
import { observer } from "mobx-react-lite";
import classes from "./EmoteWallWidget.module.css";
import { EmoteWallWidgetSettings } from "./EmoteWallWidgetSettings";
import { EmoteWallWidgetStore } from "./EmoteWallWidgetStore";

export const EmoteWallWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: EmoteWallWidgetSettings;
    store: EmoteWallWidgetStore;
  }) => {
    const containerStyle: CSSProperties = {
      ...{ ...{ width: "100%" }, ...settings.widthProperty.calcCss() },
      ...{ ...{ height: "100%" }, ...settings.heightProperty.calcCss() },
      position: "relative",
      overflow: "hidden",
    };

    const emoteSize = settings.emoteSizeProperty.value;
    const animationDuration = settings.animationDurationProperty.value;

    return (
      <div style={containerStyle}>
        {store.emotes.map((emote) => (
          <img
            key={emote.id}
            src={emote.url}
            alt={emote.name}
            className={classes.emote}
            style={{
              left: `${emote.x}%`,
              top: `${emote.y}%`,
              width: `${emoteSize}px`,
              height: `${emoteSize}px`,
              animationDuration: `${animationDuration}ms`,
            }}
          />
        ))}
      </div>
    );
  },
);

