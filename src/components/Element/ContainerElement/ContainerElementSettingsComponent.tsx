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
import { AddElementDialogStateContext } from "../../../pages/TwitchAlerts/TwitchAlertsItemSettings";
import { NotBorderedIconButton } from "../../IconButton/IconButton";
import CloseIcon from "../../../icons/CloseIcon";

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
    const addElementDialogState = useContext(AddElementDialogStateContext);

    return (
      <Flex vertical gap={18}>
        {advanced && (
          <>
            <LabeledContainer
              displayName="Вложенные элементы"
              buttons={
                <Flex align="center" gap={6}>
                  <SubActionButton
                    onClick={() => {
                      addElementDialogState.addTo(data);
                    }}
                  >
                    Создать
                  </SubActionButton>
                  <Select
                    value={null}
                    placeholder="Привязать"
                    style={{ height: "30px" }}
                    options={container.elements
                      .filter((element) => element.data.id !== data.id)
                      .map((element) => ({
                        value: element.data.id,
                        label: element.data.name,
                      }))}
                    onChange={(value) => {
                      const child = container.elements.find(
                        (element) => element.data.id === value,
                      );
                      if (child) {
                        child.data.containerId = data.id;
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
          </>
        )}
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
