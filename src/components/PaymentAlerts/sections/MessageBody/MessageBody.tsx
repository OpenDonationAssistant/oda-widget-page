import { useContext } from "react";
import classes from "./MessageBody.module.css";
import { AlertStateContext } from "../../AlertState";
import { observer } from "mobx-react-lite";

export const MessageBody = observer(({}) => {
  const state = useContext(AlertStateContext);

  return (
    <>
      {state.message && (
        <div
          style={state.messageStyle}
          className={`${classes.messagebody} ${state.messageClassName}`}
        >
          {state.message}
        </div>
      )}
    </>
  );
});
