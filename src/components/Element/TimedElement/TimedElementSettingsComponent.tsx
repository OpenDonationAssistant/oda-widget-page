import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { TimedElementSettings } from "./TimedElement";
import { Flex } from "antd";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";

export const TimedElementSettingsComponent = observer(
  ({
    settings,
    nested,
    container,
  }: {
    settings: ElementData<TimedElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    return (
      <Flex vertical gap={18}>
        <ElementList
          elementId={settings.id}
          nested={nested}
          container={container}
        />
      </Flex>
    );
  },
);
