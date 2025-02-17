import { CSSProperties, useContext, useEffect, useRef } from "react";
import classes from "./AlertImage.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";
import { reaction } from "mobx";
import { log } from "../../../../logging";

export const AlertImage = observer(
  ({
    style,
    imageStyle,
  }: {
    style?: CSSProperties;
    imageStyle?: CSSProperties;
  }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const state = useContext(AlertStateContext);

    reaction(
      () => state.image,
      () => log.debug({ image: state.image }, "image changed"),
    );

    useEffect(() => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.addEventListener("ended", () => {}); // TODO: unset video
    }, [videoRef]);

    return (
      <>
        <div
          className={`${classes.imagecontainer}`}
          style={{ ...state.imageStyle, ...style }}
        >
          {state.video && (
            <video
              ref={videoRef}
              autoPlay={true}
              src={state.video}
              className={classes.alertimage}
            />
          )}
          {state.image && (
            <>
            <img src={state.image} className={`${classes.imageoverlay}`} />
            <img
              src={state.image}
              style={{
                ...imageStyle,
              }}
              className={`${classes.alertimage} ${state.imageClassName}`}
            />
            </>
          )}
        </div>
        {!state.image && !state.video && (
          <div className={`${classes.emptyspace}`}></div>
        )}
      </>
    );
  },
);
