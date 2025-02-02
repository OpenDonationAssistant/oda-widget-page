import { useContext } from "react";
import classes from "./MessageTitle.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

export const MessageTitle = observer(({}) => {
  const state = useContext(AlertStateContext);

  return (
    <>
      {state.message && (
        <div
          style={state.titleStyle}
          className={`${classes.messageheader} ${state.titleClassName}`}
        >
          {state.title}
        </div>
      )}
    </>
  );
});
