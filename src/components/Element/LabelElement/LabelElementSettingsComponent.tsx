import { observer } from "mobx-react-lite";
import { ElementData } from "../Element";
import { LabelElementSettings } from "./LabelElement";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../Overlay/Overlay";
import { useContext, useState } from "react";
import { Col, Flex, Row, Switch } from "antd";
import classes from "./LabelElement.module.css";
import { FontSettingsOverlay } from "../../ConfigurationPage/widgetproperties/AnimatedFontComponent";
import { AnimatedFontProperty } from "../../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import SubActionButton from "../../Button/SubActionButton";
import { ImagePropertyComponent } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";
import { WidthPropertyComponent } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyComponent } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { BorderPropertyComponent } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyComponent } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingPropertyComponent } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { AnimationPropertyComponent } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { BoxShadowPropertyComponent } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import SecondaryButton from "../../Button/SecondaryButton";
import PrimaryButton from "../../Button/PrimaryButton";

const LabelTemplatesOverlay = observer(() => {
  const parentModalState = useContext(ModalStateContext);
  const [templatesModalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

  return (
    <ModalStateContext.Provider value={templatesModalState}>
      <Overlay>
        <Panel>
          <Title>Доступные шаблоны и переменные</Title>
          <Flex vertical className={`${classes.templates}`}>
            <Row className={`${classes.titles}`}>
              <Col span={8}>Шаблон</Col>
              <Col span={8}>Описание</Col>
              <Col span={8}>Пример результата</Col>
            </Row>
          </Flex>
          <Flex className="full-width" justify="flex-end" gap={9}>
            <SecondaryButton
              onClick={() => {
                templatesModalState.show = false;
              }}
            >
              Отменить
            </SecondaryButton>
            <PrimaryButton onClick={() => {}}>Применить</PrimaryButton>
          </Flex>
        </Panel>
      </Overlay>
      <SubActionButton
        onClick={() => {
          templatesModalState.show = true;
        }}
      >
        Шаблоны
      </SubActionButton>
    </ModalStateContext.Provider>
  );
});

export const LabelElementSettingsComponent = observer(
  ({ settings: data }: { settings: ElementData<LabelElementSettings> }) => {
    const parentModalState = useContext(ModalStateContext);
    const [mainWindowModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <Flex vertical gap={18}>
        <Flex vertical gap={3}>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginRight: "6px" }}
          >
            <div className={`${classes.label}`}>Текст</div>
            <Flex gap={12} align="center">
              <Flex gap={3} align="center">
                <Switch
                  checked={data.settings.hideEmpty}
                  onChange={(updated) => (data.settings.hideEmpty = updated)}
                />
                <div>Скрывать пустое</div>
              </Flex>
              <ModalStateContext.Provider value={mainWindowModalState}>
                <FontSettingsOverlay
                  property={
                    new AnimatedFontProperty({
                      name: "font",
                      value: data.settings.font,
                    })
                  }
                  onChange={(updated) => (data.settings.font = updated.value)}
                />
              </ModalStateContext.Provider>
              <LabelTemplatesOverlay />
            </Flex>
          </Flex>
          <div className={`${classes.textcontainer}`}>
            <textarea
              className={`${classes.text} ${classes.small}`}
              value={data.settings.value}
              onChange={(updated) => {
                data.settings.value = updated.target.value;
              }}
            />
            <Flex
              align="center"
              justify="flex-end"
              gap={9}
              className={`${classes.textoptions}`}
              wrap
            >
              <Flex align="center">
                <span
                  className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.justify === "top" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.justify = "top";
                  }}
                >
                  vertical_align_top
                </span>
                <span
                  className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.justify === "center" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.justify = "center";
                  }}
                >
                  vertical_align_center
                </span>
                <span
                  className={`material-symbols-sharp ${classes.alignbutton}
                    ${data.settings.justify === "bottom" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.justify = "bottom";
                  }}
                >
                  vertical_align_bottom
                </span>
              </Flex>
              <Flex align="center">
                <span
                  className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.align === "left" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.align = "left";
                  }}
                >
                  format_align_left
                </span>
                <span
                  className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.align === "center" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.align = "center";
                  }}
                >
                  format_align_center
                </span>
                <span
                  className={`material-symbols-sharp ${classes.alignbutton}
                    ${data.settings.align === "right" ? classes.selectedalign : ""}`}
                  onClick={() => {
                    data.settings.align = "right";
                  }}
                >
                  format_align_right
                </span>
              </Flex>
              <Flex gap={3} align="center">
                <Switch
                  checked={data.settings.saveFormatting}
                  onChange={(updated) =>
                    (data.settings.saveFormatting = updated)
                  }
                />
                <div>Форматирование</div>
              </Flex>
              <SubActionButton
                onClick={() => {
                  mainWindowModalState.show = true;
                }}
              >
                Настройки шрифта
              </SubActionButton>
            </Flex>
          </div>
        </Flex>
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
