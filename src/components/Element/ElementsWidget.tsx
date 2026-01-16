import { observer } from "mobx-react-lite";
import { ElementRenderer } from "./ElementRenderer";
import { Element } from "./Element";

export interface SettingsWithElements {
  elements: Element<any>[];
}

export const ElementsWidget = observer(
  ({ settings }: { settings: SettingsWithElements }) => {

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
