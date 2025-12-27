import { Element } from "../Element";
import { ReactNode } from "react";
import { QRElementSettingsComponent } from "./QRElementSettingsComponent";
import { DEFAULT_IMAGE_PROPERTY_VALUE, ImagePropertyValue } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { ColorPropertyValue, DEFAULT_COLOR_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { WidthPropertyValue } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { BorderPropertyValue, DEFAULT_BORDER_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { DEFAULT_PADDING_PROPERTY_VALUE, PaddingPropertyValue } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { DEFAULT_ROUNDING_PROPERTY_VALUE, RoundingValue } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyValue } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";

export interface QRElementSettings {
  text: string;
  size: number;
  color: string;
  backgroundImage: ImagePropertyValue;
  backgroundColor: ColorPropertyValue;
  width: WidthPropertyValue;
  height: HeightPropertyValue;
  border: BorderPropertyValue;
  padding: PaddingPropertyValue;
  rounding: RoundingValue;
  shadow: BoxShadowPropertyValue;
}

export const DEFAULT_QR_ELEMENT_SETTINGS: QRElementSettings = {
  text: "",
  size: 300,
  color: "#000000",
  backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  width: { type: "max", value: 100 } as WidthPropertyValue,
  height: { type: "max", value: 100 } as HeightPropertyValue,
  border: DEFAULT_BORDER_PROPERTY_VALUE,
  padding: DEFAULT_PADDING_PROPERTY_VALUE,
  rounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  shadow: { shadows: [] },
};

export class QRElement extends Element<QRElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return <QRElementSettingsComponent data={this.data} />;
  }
}
