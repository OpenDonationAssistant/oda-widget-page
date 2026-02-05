import { ElementsWidgetSettings } from "../../components/Element/ElementsWidgetSettings";
import { HorizontalEventsModeProperty } from "./HorizontalEventsModeProperty";

export class HorizontalEventsWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super([
      {
        key: "general",
        title: "Общие",
        properties: [new HorizontalEventsModeProperty()],
      },
    ]);
  }
}
