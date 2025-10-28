import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";

export interface TwitchAlertTrigger {
  type: string;
}

export interface TwitchAlert {
  triggers: TwitchAlertTrigger[];
}

export class TwitchAlertsProperty extends DefaultWidgetProperty<TwitchAlert[]> {
  constructor() {
    super({
      name: "alerts",
      value: [{}],
      displayName: "Оповещения",
    });
  }

  copy() {
    return new TwitchAlertsProperty();
  }

  markup(): ReactNode {
    return <div></div>;
  }
}
