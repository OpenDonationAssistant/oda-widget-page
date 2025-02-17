import { useContext } from "react";
import classes from "./MessageTitle.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

export const MessageTitle = observer(({}) => {
  const state = useContext(AlertStateContext);

  return (
    <>
      {state.showTitle && state.message && (
        <div
          style={state.titleStyle}
          className={`${classes.messageheader} ${state.titleClassName}`}
        >
          <div className={classes.text}>{state.title}</div>
          <div style={state.titleImageStyle} className={classes.image} />
        </div>
      )}
    </>
  );
});
