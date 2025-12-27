import { observer } from "mobx-react-lite";
import { SlideShowElementSettings } from "./SlideShowElement";
import { Element, ElementContainer, ElementData } from "../Element";
import { useContext } from "react";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import { Flex } from "antd";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import { AnimationPropertyComponent } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import InputNumber from "../../ConfigurationPage/components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";

export const SlideShowElementSettingsComponent = observer(
  ({
    data,
    nested,
    container,
  }: {
    data: ElementData<SlideShowElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    return (
      <Flex vertical gap={18}>
        <ElementList
          elementId={data.id}
          nested={nested}
          container={container}
        />
        <LabeledContainer displayName="Слайды">
          <Flex className="full-width" gap={6}>
            <SmallLabeledContainer displayName="Кол-во элементов на слайде">
              <InputNumber
                value={data.settings.amount}
                onChange={(value) => {
                  data.settings.period = Number(value);
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="Время отображения">
              <InputNumber
                value={data.settings.period}
                onChange={(value) => {
                  data.settings.period = Number(value);
                }}
              />
            </SmallLabeledContainer>
          </Flex>
        </LabeledContainer>
        <LabeledContainer displayName="Анимация появления">
          <AnimationPropertyComponent value={data.settings.inAnimation} />
        </LabeledContainer>
        <LabeledContainer displayName="Анимация скрытия">
          <AnimationPropertyComponent value={data.settings.outAnimation} />
        </LabeledContainer>
      </Flex>
    );
  },
);
