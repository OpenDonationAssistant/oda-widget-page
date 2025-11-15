import { ReactNode, useContext, useState } from "react";
import { Element, ElementContainer, ElementData } from "./Element";
import classes from "./LabelElement.module.css";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyComponent,
  ImagePropertyValue,
} from "../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { Flex } from "antd";
import {
  BoxShadowPropertyComponent,
  BoxShadowPropertyValue,
} from "../ConfigurationPage/widgetproperties/BoxShadowProperty";
import { ColorPropertyComponent } from "../ConfigurationPage/widgetproperties/ColorPropertyComponent";
import {
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../ConfigurationPage/widgetproperties/ColorProperty";
import {
  BorderPropertyComponent,
  BorderPropertyValue,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../ConfigurationPage/widgetproperties/BorderProperty";
import {
  DEFAULT_ROUNDING_PROPERTY_VALUE,
  RoundingPropertyComponent,
  RoundingValue,
} from "../ConfigurationPage/widgetproperties/RoundingProperty";
import {
  DEFAULT_PADDING_PROPERTY_VALUE,
  PaddingPropertyComponent,
  PaddingPropertyValue,
} from "../ConfigurationPage/widgetproperties/PaddingProperty";
import SubActionButton from "../Button/SubActionButton";
import {
  AnimationPropertyComponent,
  AnimationPropertyValue,
} from "../ConfigurationPage/widgetproperties/AnimationProperty";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { ModalState, ModalStateContext } from "../Overlay/Overlay";
import { FontSettingsOverlay } from "../ConfigurationPage/widgetproperties/AnimatedFontComponent";
import {
  AnimatedFontProperty,
  FontPropertyValue,
} from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";

export interface LabelElementSettings {
  value: string;
  font: FontPropertyValue;
  align: "left" | "center" | "right";
  backgroundImage: ImagePropertyValue;
  backgroundColor: ColorPropertyValue;
  border: BorderPropertyValue;
  padding: PaddingPropertyValue;
  rounding: RoundingValue;
  shadow: BoxShadowPropertyValue;
  inAnimation: AnimationPropertyValue;
  outAnimation: AnimationPropertyValue;
  idleAnimation: AnimationPropertyValue;
}

export const DEFAULT_LABEL_ELEMENT_SETTINGS = {
  value: "",
  align: "left",
  backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  border: DEFAULT_BORDER_PROPERTY_VALUE,
  padding: DEFAULT_PADDING_PROPERTY_VALUE,
  rounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  shadow: { shadows: [] },
  inAnimation: { animation: "none", duration: 0 },
  outAnimation: { animation: "none", duration: 0 },
  idleAnimation: { animation: "none", duration: 0 },
};

export const LabelElementCompoent = observer(
  ({ data }: { data: ElementData<LabelElementSettings> }) => {
    const parentModalState = useContext(ModalStateContext);
    const [mainWindowModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <ModalStateContext.Provider value={mainWindowModalState}>
        <Flex vertical gap={18}>
          <Flex vertical gap={3}>
            <Flex justify="space-between" align="center">
              <div className={`${classes.label}`}>Текст</div>
              <Flex gap={12} align="center">
                <Flex align="center">
                  <span
                    className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.align == "left" ? classes.selectedalign : ""}`}
                    onClick={() => {
                      data.settings.align = "left";
                    }}
                  >
                    format_align_left
                  </span>
                  <span
                    className={`material-symbols-sharp ${classes.alignbutton} ${data.settings.align == "center" ? classes.selectedalign : ""}`}
                    onClick={() => {
                      data.settings.align = "center";
                    }}
                  >
                    format_align_center
                  </span>
                  <span
                    className={`material-symbols-sharp ${classes.alignbutton}
                    ${data.settings.align == "right" ? classes.selectedalign : ""}`}
                    onClick={() => {
                      data.settings.align = "right";
                    }}
                  >
                    format_align_right
                  </span>
                </Flex>
                <SubActionButton onClick={() => {
                  mainWindowModalState.show = true;
                }}>
                  Настройки шрифта
                </SubActionButton>
                <FontSettingsOverlay
                  property={
                    new AnimatedFontProperty({
                      name: "font",
                      value: data.settings.font,
                    })
                  }
                  onChange={(updated) => (data.settings.font = updated.value)}
                />
              </Flex>
            </Flex>
            <textarea
              className={`${classes.text} ${classes.small}`}
              value={data.settings.value}
              onChange={(updated) => {
                data.settings.value = updated.target.value;
              }}
            />
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
          <LabeledContainer displayName="Анимации">
            <Flex vertical className="full-width" gap={9}>
              <AnimationPropertyComponent
                displayName="Анимация появления"
                value={data.settings.inAnimation}
              />
              <AnimationPropertyComponent
                displayName="Основная анимация"
                value={data.settings.idleAnimation}
              />
              <AnimationPropertyComponent
                displayName="Анимация скрытия"
                value={data.settings.outAnimation}
              />
            </Flex>
          </LabeledContainer>
          <BoxShadowPropertyComponent
            displayName="Тени"
            value={data.settings.shadow}
            buttonClassName={classes.addshadowbutton}
          />
        </Flex>
      </ModalStateContext.Provider>
    );
  },
);

export class LabelElement extends Element<LabelElementSettings> {
  constructor(
    data: ElementData<LabelElementSettings>,
    container: ElementContainer,
  ) {
    super(data, container);
  }

  markup(): ReactNode {
    return <LabelElementCompoent data={this.data} />;
  }
}
