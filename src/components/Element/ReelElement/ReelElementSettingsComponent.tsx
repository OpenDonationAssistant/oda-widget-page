import { Flex } from "antd";
import { ElementData } from "../Element";
import { ReelElementSettings } from "./ReelElement";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import InputNumber from "../../ConfigurationPage/components/InputNumber";
import { AnimatedFontComponent } from "../../ConfigurationPage/widgetproperties/AnimatedFontComponent";
import { AnimatedFontProperty } from "../../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { BorderPropertyComponent } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";

export const ReelElementSettingsComponent = ({
  data,
}: {
  data: ElementData<ReelElementSettings>;
}) => {
  return (
    <Flex vertical gap={9}>
      <LabeledContainer displayName="Кол-во отображаемых карточек">
        <InputNumber
          value={data.settings.perView}
          onChange={(value) => {
            data.settings.perView = Number(value);
          }}
        />
      </LabeledContainer>
      <LabeledContainer displayName="Скорость">
        <InputNumber
          value={data.settings.speed}
          onChange={(value) => {
            data.settings.speed = Number(value);
          }}
        />
      </LabeledContainer>
      <LabeledContainer displayName="Время до выпадения результата">
        <InputNumber
          value={data.settings.time}
          onChange={(value) => {
            data.settings.time = Number(value);
          }}
        />
      </LabeledContainer>
      <AnimatedFontComponent
        property={
          new AnimatedFontProperty({
            name: "titleFont",
            value: data.settings.titleFont,
          })
        }
      />
      <BorderPropertyComponent
        help="Рамка"
        value={data.settings.cardBorder}
        displayName="Рамка карточки"
      />
      <ColorPropertyComponent
        property={{
          value: data.settings.selectionColor,
          displayName: "Фон",
        }}
        onChange={(updated) => (data.settings.selectionColor = updated)}
      />
    </Flex>
  );
};
