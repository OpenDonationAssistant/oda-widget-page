import { log } from "../../../logging";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super(
      {
        sections: [
          {
            key: "general",
            title: "Общие",
            properties: [
              new BooleanProperty({
                name: "audioOnly",
                value: false,
                displayName: "widget-player-popup-sound-only",
              }),
              new BorderProperty({
                name: "widgetBorder",
                displayName: "widget-player-popup-border",
              })
            ],
          },
        ],
      },
    );
  }
}
