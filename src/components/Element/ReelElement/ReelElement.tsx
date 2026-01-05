import { ReactNode } from "react";
import { Element } from "../Element";
import { ReelElementSettingsComponent } from "./ReelElementSettingsComponent";
import {
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/ColorProperty";
import {
  BorderPropertyValue,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyValue,
} from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import {
  DEFAULT_FONT_PROPERTY_VALUE,
  FontPropertyValue,
} from "../../ConfigurationPage/widgetproperties/AnimatedFontProperty";

export interface ReelElementSettings {
  speed: number;
  perView: number;
  time: number;
  selectionColor: ColorPropertyValue;
  itemBackgroundImage: ImagePropertyValue;
  cardBorder: BorderPropertyValue;
  titleFont: FontPropertyValue;
}

export const DEFAULT_REEL_ELEMENT_SETTINGS: ReelElementSettings = {
  speed: 250,
  perView: 5,
  time: 10,
  selectionColor: DEFAULT_COLOR_PROPERTY_VALUE,
  itemBackgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  cardBorder: DEFAULT_BORDER_PROPERTY_VALUE,
  titleFont: DEFAULT_FONT_PROPERTY_VALUE,
};

export class ReelElement extends Element<ReelElementSettings> {
  markup(): ReactNode {
    return <ReelElementSettingsComponent data={this.data} />;
  }
}
