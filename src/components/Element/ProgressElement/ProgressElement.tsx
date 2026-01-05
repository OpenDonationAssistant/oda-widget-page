import { ReactNode } from "react";
import { Element } from "../Element";
import { DEFAULT_PADDING_PROPERTY_VALUE, PaddingPropertyValue } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { ProgressElementSettingsComponent } from "./ProgressElementSettingsComponent";
import { ColorPropertyValue, DEFAULT_COLOR_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { BorderPropertyValue, DEFAULT_BORDER_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { DEFAULT_ROUNDING_PROPERTY_VALUE, RoundingValue } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyValue, DEFAULT_SHADOW } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import { DEFAULT_IMAGE_PROPERTY_VALUE, ImagePropertyValue } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";

export interface ProgressElementSettings {
  innerPadding: PaddingPropertyValue;
  innerBorder: BorderPropertyValue;
  innerRounding: RoundingValue;
  innerBoxShadow: BoxShadowPropertyValue;
  filledColor: ColorPropertyValue;
  innerImage: ImagePropertyValue;
  filledHeight: HeightPropertyValue;

  barPadding: PaddingPropertyValue;
  outerBorder: BorderPropertyValue;
  outerRounding: RoundingValue;
  outerBoxShadow: BoxShadowPropertyValue;
  backgroundColor: ColorPropertyValue;
  outerImage: ImagePropertyValue;
  outerHeight: HeightPropertyValue;
}

export const DEFAULT_PROGRESS_ELEMENT_SETTINGS = {
  innerPadding: DEFAULT_PADDING_PROPERTY_VALUE,
  innerBorder: DEFAULT_BORDER_PROPERTY_VALUE,
  innerRounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  innerBoxShadow: { shadows: [DEFAULT_SHADOW] },
  filledColor: DEFAULT_COLOR_PROPERTY_VALUE,
  innerImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  filledHeight: { type: "min", value: 100 },

  barPadding: DEFAULT_PADDING_PROPERTY_VALUE,
  outerBorder: DEFAULT_BORDER_PROPERTY_VALUE,
  outerRounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  outerBoxShadow: { shadows: [DEFAULT_SHADOW] },
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  outerImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  outerHeight: { type: "min", value: 100 },
};

export class ProgressElement extends Element<ProgressElementSettings> {
  markup(): ReactNode {
    return <ProgressElementSettingsComponent data={this.data} />;
  }
}
