import { log } from "../../../logging";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    super(
      widgetId,
      properties,
      [
        new BooleanProperty(
          widgetId,
          "audioOnly",
          "boolean",
          false,
          "widget-player-popup-sound-only",
        ),
        new BorderProperty({
          widgetId: widgetId,
          name: "widgetBorder",
        }),
      ],
      new Map(),
    );
  }
  public copy() {
    log.debug("copying PlayerPopupWidgetSettings");
    return new PlayerPopupWidgetSettings(this.widgetId, this.properties);
  }
}
