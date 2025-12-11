import { useContext } from "react";
import classes from "./MessageTitle.module.css";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";
import { TextRenderer } from "../../../../components/Renderer/TextRenderer";
import { AlignmentRenderer } from "../../../../components/Renderer/AlignmentRenderer";

export const MessageTitle = observer(() => {
  const state = useContext(AlertStateContext);

  if (!state.showTitle) {
    return <></>;
  }

  if (!state.title) {
    return <></>;
  }

  if (!state.titleAlignment) {
    return <></>;
  }

  if (!state.titleFont) {
    return <></>;
  }

  return (
    <AlignmentRenderer alignment={state.titleAlignment}>
      <div className={state.headerClassName} style={state.headerStyle}>
        <div className={`${classes.messageheader}`} style={state.titleStyle}>
          <TextRenderer text={state.title} font={state.titleFont} />
          <div style={state.titleImageStyle} className={classes.image} />
        </div>
      </div>
    </AlignmentRenderer>
  );
});
