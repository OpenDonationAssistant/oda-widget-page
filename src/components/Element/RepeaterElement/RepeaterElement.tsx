import { ReactNode } from "react";
import { Element } from "../Element";
import { RepeaterElementSettingsComponent } from "./RepeaterElementSettingsComponent";

export interface RepeaterElementSettings {
  target: string;
}

export const DEFAULT_REPEATER_ELEMENT_SETTINGS = {
  target: "items",
};

export class RepeaterElement extends Element<RepeaterElementSettings> {
  markup(): ReactNode {
    if (!this.container) {
      return <></>;
    }
    return (
      <RepeaterElementSettingsComponent
        data={this.data}
        nested={this.children}
        container={this.container}
      />
    );
  }
}
