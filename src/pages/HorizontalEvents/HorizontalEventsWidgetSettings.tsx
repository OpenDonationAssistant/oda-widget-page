import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { HorizontalEventsModeProperty } from "./HorizontalEventsModeProperty";

export class HorizontalEventsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new HorizontalEventsModeProperty(),
      ],
    });

    this.addElementsTab();
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo() {
    return (
      <></>
    );
  }
}
