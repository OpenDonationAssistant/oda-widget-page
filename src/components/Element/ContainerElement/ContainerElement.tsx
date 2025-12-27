import { ReactNode } from "react";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyValue,
} from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import {
  BorderPropertyValue,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { BoxShadowPropertyValue } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  ColorPropertyValue,
  DEFAULT_COLOR_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { HeightPropertyValue } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import {
  DEFAULT_PADDING_PROPERTY_VALUE,
  PaddingPropertyValue,
} from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import {
  DEFAULT_ROUNDING_PROPERTY_VALUE,
  RoundingValue,
} from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { WidthPropertyValue } from "../../ConfigurationPage/widgetproperties/WidthProperty";
import { Element } from "../Element";
import { ContainerElementSettingsComponent } from "./ContainerElementSettingsComponent";

export interface ContainerElementSettings {
  align: "left" | "center" | "right";
  justify: "top" | "center" | "bottom";
  direction: "row" | "column" | "stack";
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

export const DEFAULT_CONTAINER_ELEMENT_SETTINGS = {
  align: "center" as "left" | "center" | "right",
  justify: "top" as "top" | "center" | "bottom",
  direction: "row" as "row" | "column" | "stack",
  backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
  border: DEFAULT_BORDER_PROPERTY_VALUE,
  padding: DEFAULT_PADDING_PROPERTY_VALUE,
  rounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  width: { type: "max", value: 100 } as WidthPropertyValue,
  height: { type: "max", value: 100 } as HeightPropertyValue,
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  shadow: { shadows: [] },
  animation: { animation: "none", duration: 0 },
};

export class ContainerElement extends Element<ContainerElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <ContainerElementSettingsComponent
        data={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
