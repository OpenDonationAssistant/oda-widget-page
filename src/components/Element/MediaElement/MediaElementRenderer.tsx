import { observer } from "mobx-react-lite";
import { MediaElementSettings } from "./MediaElement";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { fullUri } from "../../../utils";
import { ContainerElementRenderer } from "../ContainerElement/ContainerElementRenderer";
import { DEFAULT_IMAGE_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { DEFAULT_COLOR_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/ColorProperty";
import classes from "./MediaElementRenderer.module.css";

export const MediaElementRenderer = observer(
  ({ settings }: { settings: MediaElementSettings }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [url, setUrl] = useState<string>("");

    useEffect(() => {
      fullUri(settings.url).then((image) => setUrl(image));
    }, [settings.url]);

    const style = {} as CSSProperties;
    if (settings.width.type === "min"){
      style.width = "unset";
    }
    if (settings.height.type === "min"){
      style.height = "unset";
    }

    return (
      <ContainerElementRenderer
        settings={{
          ...settings,
          ...{
            backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
            backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
            justify: "center",
            align: "center",
          },
        }}
        style={style}
      >
        {settings.type === "video" && (
          <video
            onLoadStart={() => {
              if (videoRef.current) {
                // videoRef.current.volume = state.imageVolume / 100;
              }
            }}
            className={`${classes.image}`}
            ref={videoRef}
            autoPlay={true}
            src={url}
          />
        )}
        {settings.type === "image" && (
          <img className={`${classes.image}`} src={url} />
        )}
      </ContainerElementRenderer>
    );
  },
);
