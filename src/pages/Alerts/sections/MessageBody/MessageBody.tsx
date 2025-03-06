import { useContext } from "react";
import classes from "./MessageBody.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

export const MessageBody = observer(({}) => {
  const state = useContext(AlertStateContext);

  return (
    <>
      {state.showMessage && state.message && (
        <div className={state.messageContainerClassName} style={state.messageContainerStyle}>
          <div
            style={state.messageStyle}
            className={`${classes.messagebody} ${state.messageClassName}`}
          >
            <div className={classes.text}>{state.message}</div>
            <div style={state.messageImageStyle} className={classes.image} />
          </div>
        </div>
      )}
    </>
  );
});
