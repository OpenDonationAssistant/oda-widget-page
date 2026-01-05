import { ReactNode } from "react";
import { Element } from "../Element";
import { ProgressElementSvgSettings } from "./ProgressElementSvgSettings";
import { ProgressElementSvgSettingsComponent } from "./ProgressElementSvgSettingsComponent";

export class ProgressElementSvg extends Element<ProgressElementSvgSettings> {
  markup(): ReactNode {
    return <ProgressElementSvgSettingsComponent data={this.data} />;
  }
}
