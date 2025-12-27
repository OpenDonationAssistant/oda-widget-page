import { ReactNode } from "react";
import { Element } from "../Element";
import { SlideShowElementSettingsComponent } from "./SlideShowElementSettingsComponent";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";

export interface SlideShowElementSettings {
  amount: number,
  inAnimation: AnimationPropertyValue;
  outAnimation: AnimationPropertyValue;
  period: number;
}

export const DEFAULT_SLIDESHOW_ELEMENT_SETTINGS: SlideShowElementSettings = {
  amount: 1,
  inAnimation: { animation: "none", duration: 1000 },
  outAnimation: { animation: "none", duration: 1000 },
  period: 10000,
};

export class SlideShowElement extends Element<SlideShowElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <SlideShowElementSettingsComponent
        data={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
