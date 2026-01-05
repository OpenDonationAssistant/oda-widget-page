import { Element } from "../Element";
import { ReactNode } from "react";
import { TimedElementSettingsComponent } from "./TimedElementSettingsComponent";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";

export interface TimedElementSettings {
  shownDuration: number;
  hiddenDuration: number;
  inAnimation: AnimationPropertyValue;
  outAnimation: AnimationPropertyValue;
}

export const DEFAULT_TIMED_ELEMENT_SETTINGS: TimedElementSettings = {
  shownDuration: 1000,
  hiddenDuration: 1000,
  inAnimation: { animation: "none", duration: 1000 },
  outAnimation: { animation: "none", duration: 1000 },
};

export class TimedElement extends Element<TimedElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <TimedElementSettingsComponent
        settings={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
