import { observer } from "mobx-react-lite";
import { SocialsWidgetSettings } from "./SocialsWidgetSettings";
import { ElementRenderer } from "../../components/Element/ElementRenderer";

export const SocialsWidget = observer(
  ({ settings }: { settings: SocialsWidgetSettings }) => {
    return (
      <>
        {settings.elements
          .filter((element) => element.data.containerId === null)
          .map((element) => (
            <ElementRenderer element={element} key={element.data.id} />
          ))}
      </>
    );
  },
);
