import { useContext } from "react";
import classes from "./MessageBody.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";
import { TextRenderer } from "../../../../components/Renderer/TextRenderer";
import { AlignmentRenderer } from "../../../../components/Renderer/AlignmentRenderer";

export const MessageBody = observer(() => {
  const state = useContext(AlertStateContext);

  if (!state.showMessage) {
    return <></>;
  }

  if (!state.message) {
    return <></>;
  }

  if (!state.messageAlignment) {
    return <></>;
  }

  if (!state.messageFont) {
    return <></>;
  }

  return (
    <AlignmentRenderer alignment={state.messageAlignment}>
      <div
        className={state.messageContainerClassName}
        style={state.messageContainerStyle}
      >
        <div className={`${classes.messagebody}`} style={state.messageStyle}>
          <TextRenderer text={state.message} font={state.messageFont} />
          <div style={state.messageImageStyle} className={classes.image} />
        </div>
      </div>
    </AlignmentRenderer>
  );
});
