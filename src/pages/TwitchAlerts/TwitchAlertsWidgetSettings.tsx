import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { TwitchAlertsProperty } from "./TwitchAlertsProperty";

export class TwitchAlertsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Оповещения",
      properties: [new TwitchAlertsProperty()],
    });
  }

  public hasDemo(): boolean {
    return false;
  }
}
