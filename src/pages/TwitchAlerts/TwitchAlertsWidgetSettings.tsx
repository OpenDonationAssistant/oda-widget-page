import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { TwitchAlertsProperty } from "./TwitchAlertsProperty";

export class TwitchAlertsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "alerts",
          title: "Оповещения",
          properties: [new TwitchAlertsProperty()],
        },
        {
          key: "configs",
          title: "tab-alert-configs",
          properties: [
            new BooleanProperty({
              name: "pause-media",
              value: true,
              displayName: "Паузить медиаплеер",
            }),
          ],
        },
      ],
    });
  }

  public get twitchAlertsProperty(): TwitchAlertsProperty {
    return this.get("alerts") as TwitchAlertsProperty;
  }

  public get premoderation(): boolean {
    return false;
  }

  public get pauseMedia(): boolean {
    return this.get("pause-media")?.value;
  }

  public hasDemo(): boolean {
    return false;
  }
}
