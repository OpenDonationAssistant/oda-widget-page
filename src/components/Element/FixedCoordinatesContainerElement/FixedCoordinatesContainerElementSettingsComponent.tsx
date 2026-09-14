import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import {
  ElementPosition,
  FixedCoordinatesContainerElementSettings,
} from "./FixedCoordinatesContainerElement";
import { useContext } from "react";
import { Flex } from "antd";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import classes from "./FixedCoordinatesContainerElementSettingsComponent.module.css";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";
import { ImagePropertyComponent } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { WidthPropertyComponent } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyComponent } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { BorderPropertyComponent } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyComponent } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingPropertyComponent } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { BoxShadowPropertyComponent } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import { AnimationPropertyComponent } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import InputNumber from "../../ConfigurationPage/components/InputNumber";

const ChildCoordinates = ({
  name,
  position,
  onChange,
}: {
  name: string;
  position: ElementPosition;
  onChange: (position: ElementPosition) => void;
}) => {
  return (
    <Flex align="end" gap={9} className={classes.coordinatesrow}>
      <div className={classes.childname}>{name}</div>
      <LabeledContainer displayName="X">
        <InputNumber
          value={position.x}
          addon="px"
          onChange={(x) => onChange({ ...position, x })}
        />
      </LabeledContainer>
      <LabeledContainer displayName="Y">
        <InputNumber
          value={position.y}
          addon="px"
          onChange={(y) => onChange({ ...position, y })}
        />
      </LabeledContainer>
      <LabeledContainer displayName="Высота">
        <InputNumber
          value={position.zIndex ?? 0}
          onChange={(zIndex) => onChange({ ...position, zIndex })}
        />
      </LabeledContainer>
    </Flex>
  );
};

export const FixedCoordinatesContainerElementSettingsComponent = observer(
  ({
    data,
    nested,
    container,
  }: {
    data: ElementData<FixedCoordinatesContainerElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    const advanced = useContext(AdvancedSettingsStoreContext).enabled;

    return (
      <Flex vertical gap={18}>
        <ElementList
          elementId={data.id}
          nested={nested}
          container={container}
        />
        {advanced && nested.length > 0 && (
          <LabeledContainer displayName="Координаты элементов">
            <Flex gap={9} wrap className="full-width">
              {nested.map((child) => (
                <ChildCoordinates
                  key={child.data.id}
                  name={child.data.name}
                  position={
                    data.settings.positions[child.data.id] ?? { x: 0, y: 0 }
                  }
                  onChange={(position) => {
                    data.settings.positions[child.data.id] = position;
                  }}
                />
              ))}
            </Flex>
          </LabeledContainer>
        )}
        <LabeledContainer displayName="Поворот содержимого по часовой стрелке">
          <InputNumber
            value={data.settings.rotation}
            addon="deg"
            onChange={(value) => {
              data.settings.rotation = Number(value);
            }}
          />
        </LabeledContainer>
        <ColorPropertyComponent
          property={{
            value: data.settings.backgroundColor,
            displayName: "Фон",
          }}
          onChange={(updated) => (data.settings.backgroundColor = updated)}
        />
        <ImagePropertyComponent
          displayName="Фоновое изображение"
          value={data.settings.backgroundImage}
        />
        <WidthPropertyComponent property={data.settings.width} />
        <HeightPropertyComponent property={data.settings.height} />
        <BorderPropertyComponent
          help="Рамка вокруг всего содержимого"
          value={data.settings.border}
          displayName="Граница"
        />
        <PaddingPropertyComponent
          displayName="Отступ"
          value={data.settings.padding}
        />
        <RoundingPropertyComponent
          displayName="Скругление"
          value={data.settings.rounding}
        />
        <LabeledContainer displayName="Анимация">
          <Flex vertical className="full-width" gap={9}>
            <AnimationPropertyComponent value={data.settings.animation} />
          </Flex>
        </LabeledContainer>
        <BoxShadowPropertyComponent
          displayName="Тени"
          value={data.settings.shadow}
        />
      </Flex>
    );
  },
);
