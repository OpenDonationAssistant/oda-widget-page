import { ReactNode } from "react";
import { AbstractWidgetSettings } from "../ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { ElementsProperty } from "./ElementsProperty";
import { ElementsWidget } from "./ElementsWidget";

export class ElementsWidgetSettings extends AbstractWidgetSettings {

  constructor() {
    super({ sections: [] });
    super.addElementsTab();
  }

  public get elements() {
    return (
      (this.get("elements") ??
        new ElementsProperty({ value: [], available: [] })) as ElementsProperty
    ).elements;
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    return <ElementsWidget settings={this} />;
  }

}
