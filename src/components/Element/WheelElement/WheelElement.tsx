import { ReactNode } from "react";
import { Element } from "../Element";
import { WheelElementSettingsComponent } from "./WheelElementSettingsComponent";

export interface WheelElementSettings {}

export const DEFAULT_WHEEL_ELEMENT_SETTINGS: WheelElementSettings = {};

export class WheelElement extends Element<WheelElementSettings> {
  markup(): ReactNode {
    return <WheelElementSettingsComponent data={this.data} />;
  }
}
