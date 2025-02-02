import { useContext } from "react";
import classes from "./MessageBody.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

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
