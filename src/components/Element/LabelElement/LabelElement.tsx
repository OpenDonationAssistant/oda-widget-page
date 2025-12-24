import { ReactNode } from "react";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyValue,
} from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { BoxShadowPropertyValue } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/ColorProperty";
import {
  BorderPropertyValue,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import {
  DEFAULT_ROUNDING_PROPERTY_VALUE,
  RoundingValue,
} from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import {
  DEFAULT_PADDING_PROPERTY_VALUE,
  PaddingPropertyValue,
} from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import {
  DEFAULT_FONT_PROPERTY_VALUE,
  FontPropertyValue,
} from "../../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { WidthPropertyValue } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { Element } from "../Element";
import { LabelElementSettingsComponent } from "./LabelElementSettingsComponent";

export interface LabelElementSettings {
  value: string;
  font: FontPropertyValue;
  saveFormatting: boolean;
  hideEmpty: boolean;
  align: "left" | "center" | "right";
  justify: "top" | "center" | "bottom";
  backgroundImage: ImagePropertyValue;
  backgroundColor: ColorPropertyValue;
  width: WidthPropertyValue;
  height: HeightPropertyValue;
  border: BorderPropertyValue;
  padding: PaddingPropertyValue;
  rounding: RoundingValue;
  shadow: BoxShadowPropertyValue;
  animation: AnimationPropertyValue;
}

export const DEFAULT_LABEL_ELEMENT_SETTINGS = {
  value: "",
  font: DEFAULT_FONT_PROPERTY_VALUE,
  align: "left",
  justify: "center",
  backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  width: { type: "max", value: 100 },
  height: { type: "min", value: 100 },
  border: DEFAULT_BORDER_PROPERTY_VALUE,
  padding: DEFAULT_PADDING_PROPERTY_VALUE,
  rounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  shadow: { shadows: [] },
  animation: { animation: "none", duration: 0 },
};

export class LabelElement extends Element<LabelElementSettings> {
  markup(): ReactNode {
    return <LabelElementSettingsComponent settings={this.data} />;
  }
}
