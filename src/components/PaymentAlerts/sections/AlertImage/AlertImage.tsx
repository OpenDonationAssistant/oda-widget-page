import { useContext, useEffect, useRef } from "react";
import classes from "./AlertImage.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

export const AlertImage = observer(({}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const state = useContext(AlertStateContext);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.addEventListener("ended", () => {}); // TODO: unset video
  }, [videoRef]);

  return (
    <>
      {state.video && (
        <video
          ref={videoRef}
          autoPlay={true}
          src={state.video}
          style={state.imageStyle}
          className={classes.alertimage}
        />
      )}
      {state.image && (
        <img
          src={state.image}
          style={state.imageStyle}
          className={`${classes.alertimage} ${state.imageClassName}`}
        />
      )}
      {!state.image && !state.video && (
        <div className={`${classes.emptyspace}`}></div>
      )}
    </>
  );
});
