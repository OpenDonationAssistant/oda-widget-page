import { Element } from "../Element";
import { ReactNode } from "react";
import { TimedElementSettingsComponent } from "./TimedElementSettingsComponent";

export interface TimedElementSettings {}

export const DEFAULT_TIMED_ELEMENT_SETTINGS: TimedElementSettings = {};

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
