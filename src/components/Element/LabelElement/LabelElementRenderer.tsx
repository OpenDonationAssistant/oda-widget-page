import { observer } from "mobx-react-lite";
import { LabelElementSettings } from "./LabelElement";
import { VariableStoreContext } from "../../../stores/VariableStore";
import { useContext } from "react";
import { TextRenderer } from "../../Renderer/TextRenderer";
import { ContainerElementRenderer } from "../ContainerElement/ContainerElementRenderer";

export const LabelElementRenderer = observer(
  ({ settings }: { settings: LabelElementSettings }) => {
    const variables = useContext(VariableStoreContext);
    const dynamicText = variables.processTemplate(settings.value);
    const text = dynamicText.text;
    const textLen = text.trim().length;

    if (settings.hideEmpty && textLen === 0) {
      return <></>;
    }

    return (
      <ContainerElementRenderer
        settings={{ ...settings, ...{ direction: "row" } }}
      >
        <TextRenderer
          text={text}
          font={settings.font}
          saveFormatting={settings.saveFormatting}
        />
      </ContainerElementRenderer>
    );
  },
);
