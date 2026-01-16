import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { ContainerElementSettings } from "./ContainerElement";
import { useContext } from "react";
import { Flex, Segmented, Select } from "antd";
import classes from "./ContainerElementSettingsComponent.module.css";
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
import SubActionButton from "../../Button/SubActionButton";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import { NotBorderedIconButton } from "../../IconButton/IconButton";
import CloseIcon from "../../../icons/CloseIcon";
import { AddElementDialogStateContext } from "../ElementsTab";
import InputNumber from "../../ConfigurationPage/components/InputNumber";

export const ElementList = observer(
  ({
    elementId,
    nested,
    container,
  }: {
    elementId: string;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    const addElementDialogState = useContext(AddElementDialogStateContext);

    const advanced = useContext(AdvancedSettingsStoreContext).enabled;
    if (!advanced) {
      return <></>;
    }

    return (
      <LabeledContainer
        displayName="Вложенные элементы"
        buttons={
          <Flex align="center" gap={6}>
            <SubActionButton
              onClick={() => {
                addElementDialogState.addTo(elementId);
              }}
            >
              Создать
            </SubActionButton>
            <Select
              value={null}
              placeholder="Привязать"
              style={{ height: "30px" }}
              options={container.elements
                .filter((element) => element.data.id !== elementId)
                .map((element) => ({
                  value: element.data.id,
                  label: element.data.name,
                }))}
              onChange={(value) => {
                const parent = container.elements.find(
                  (element) => element.data.id === elementId,
                );
                const child = container.elements.find(
                  (element) => element.data.id === value,
                );
                if (child && parent) {
                  child.data.containerId = elementId;
                  child.data.level =
                    parent.data.level + (child.data.advanced ? 0 : 1);
                  child.data.advancedLevel = parent.data.advancedLevel + 1;
                }
              }}
            />
          </Flex>
        }
      >
        <Flex className="full-width" gap={9} align="center" wrap>
          {nested.map((element, index) => (
            <Flex
              key={element.data.id}
              align="center"
              wrap
              className={`${classes.childname}`}
            >
              <div>{element.data.name}</div>
              <NotBorderedIconButton
                onClick={() => {
                  element.data.containerId = null;
                }}
              >
                <CloseIcon color="#FF8888" />
              </NotBorderedIconButton>
            </Flex>
          ))}
        </Flex>
      </LabeledContainer>
    );
  },
);

export const ContainerElementSettingsComponent = observer(
  ({
    data,
    nested,
    container,
  }: {
    data: ElementData<ContainerElementSettings>;
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
        {advanced && (
          <LabeledContainer displayName="Расположение содержимого">
            <Segmented
              className="full-width"
              options={[
                {
                  value: "row",
                  label: "Горизонтально",
                },
                {
                  value: "column",
                  label: "Вертикально",
                },
                {
                  value: "stack",
                  label: "Поверх друг друга",
                },
              ]}
            />
          </LabeledContainer>
        )}
        <LabeledContainer displayName="Расстояние между элементами">
          <InputNumber
            value={data.settings.gap}
            addon="px"
            onChange={(value) => {
              data.settings.gap = Number(value);
            }}
          />
        </LabeledContainer>
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
          help="Рамка"
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
          buttonClassName={classes.addshadowbutton}
        />
      </Flex>
    );
  },
);
