import { Element } from "../Element";
import { ReactNode } from "react";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { AnimationsElementSettingsComponent } from "./AnimationsElementSettingsComponent";

export interface AnimationsElementSettings {
  inAnimation: AnimationPropertyValue;
  outAnimation: AnimationPropertyValue;
}

export const DEFAULT_ANIMATIONS_ELEMENT_SETTINGS: AnimationsElementSettings = {
  inAnimation: { animation: "none", duration: 1000 },
  outAnimation: { animation: "none", duration: 1000 },
};

export class AnimationsElement extends Element<AnimationsElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <AnimationsElementSettingsComponent
        settings={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
