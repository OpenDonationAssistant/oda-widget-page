import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { AnimationsElementSettings } from "./AnimationsElement";
import { Flex } from "antd";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import { useContext } from "react";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { AnimationPropertyComponent } from "../../ConfigurationPage/widgetproperties/AnimationProperty";

export const AnimationsElementSettingsComponent = observer(
  ({
    settings,
    nested,
    container,
  }: {
    settings: ElementData<AnimationsElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    const advanced = useContext(AdvancedSettingsStoreContext).enabled;

    return (
      <Flex vertical gap={18}>
        {advanced && (
          <ElementList
            elementId={settings.id}
            nested={nested}
            container={container}
          />
        )}
        <LabeledContainer displayName="Анимация появления">
          <AnimationPropertyComponent value={settings.settings.inAnimation} />
        </LabeledContainer>
        <LabeledContainer displayName="Анимация скрытия">
          <AnimationPropertyComponent value={settings.settings.outAnimation} />
        </LabeledContainer>
      </Flex>
    );
  },
);
