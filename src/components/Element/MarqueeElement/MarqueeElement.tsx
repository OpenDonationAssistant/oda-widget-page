import { ReactNode } from "react";
import { Element } from "../Element";
import { MarqueeElementSettingsComponent } from "./MarqueeElementComponent";

export interface MarqueeElementSettings {
  direction: "up" | "down" | "left" | "right";
  speed: number;
  autofill: boolean;
}

export const DEFAULT_MARQUEE_ELEMENT_SETTINGS = {
  direction: "left",
  speed: 2000,
  autofill: true,
};

export class MarqueeElement extends Element<MarqueeElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <MarqueeElementSettingsComponent
        data={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
