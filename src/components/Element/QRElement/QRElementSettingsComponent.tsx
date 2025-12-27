import { observer } from "mobx-react-lite";
import { ElementData } from "../Element";
import { QRElementSettings } from "./QRElement";
import { ColorPicker, Flex, Input } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";
import { ImagePropertyComponent } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { WidthPropertyComponent } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyComponent } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { BorderPropertyComponent } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyComponent } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingPropertyComponent } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyComponent } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import classes from "./QRElementSettingsComponent.module.css";
import InputNumber from "../../ConfigurationPage/components/InputNumber";

export const QRElementSettingsComponent = observer(
  ({ data }: { data: ElementData<QRElementSettings> }) => {
    return (
      <Flex vertical gap={18}>
        <LabeledContainer displayName="URL">
          <Input
            value={data.settings.text}
            onChange={(e) => (data.settings.text = e.target.value)}
          />
        </LabeledContainer>
        <LabeledContainer displayName="QR">
          <Flex gap={6} className="full-width">
            <InputNumber
              className={`${classes.size}`}
              value={data.settings.size}
              onChange={(value) => {
                data.settings.size = Number(value);
              }}
            />
            <ColorPicker
              className={`${classes.colorpicker}`}
              value={data.settings.color}
              showText
              onChange={(color) => {
                data.settings.color = color.toRgbString();
              }}
            />
          </Flex>
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
        <BoxShadowPropertyComponent
          displayName="Тени"
          value={data.settings.shadow}
          buttonClassName={classes.addshadowbutton}
        />
      </Flex>
    );
  },
);
