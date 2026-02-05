import {
  AbstractWidgetSettings,
  SettingsSection,
} from "../ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { ElementsProperty } from "./ElementsProperty";
import { ElementFactory } from "./ElementFactory";
import { Preset } from "../../types/Preset";
import { ReactNode } from "react";
import { ElementsWidget } from "./ElementsWidget";

export class ElementsWidgetSettings extends AbstractWidgetSettings {
  constructor(sections?: SettingsSection[]) {
    super({ sections: sections ?? [] });
    this.addSection({
      key: "elements",
      title: "Внешний вид",
      properties: [
        new ElementsProperty({
          value: [],
          available: ElementFactory.list(),
        }),
      ],
    });
  }

  public get elements() {
    return (
      (this.get("elements") ??
        new ElementsProperty({ value: [], available: [] })) as ElementsProperty
    ).elements;
  }

  public apply(preset: Preset): void {
    const elements = preset.properties.find(
      (it) => it.name === "elements",
    )?.value;
    (this.get("elements") as ElementsProperty).value = elements ?? [];
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    return <ElementsWidget settings={this} />;
  }
}
