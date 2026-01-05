import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { TimedElementSettings } from "./TimedElement";
import { Flex } from "antd";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import { useContext } from "react";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import InputNumber from "../../ConfigurationPage/components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import { AnimationPropertyComponent } from "../../ConfigurationPage/widgetproperties/AnimationProperty";

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
        <LabeledContainer displayName="Интервалы">
          <Flex gap={6} className="full-width">
            <SmallLabeledContainer displayName="Время скрытия">
              <InputNumber
                value={settings.settings.shownDuration}
                onChange={(value) => {
                  settings.settings.shownDuration = Number(value);
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="Время отображения">
              <InputNumber
                value={settings.settings.hiddenDuration}
                onChange={(value) => {
                  settings.settings.hiddenDuration = Number(value);
                }}
              />
            </SmallLabeledContainer>
          </Flex>
        </LabeledContainer>
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
