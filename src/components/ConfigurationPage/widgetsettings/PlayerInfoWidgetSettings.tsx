import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    super(
      widgetId,
      properties,
      [
        new AnimatedFontProperty({
          widgetId: widgetId,
          name: "titleFont",
        }),
        // new  TextProperty(
        //   widgetId,
        //   "titleTemplate",
        //   "choice",
        //   "играет <title>",
        //   "Шаблон названия",
        // ),
      ],
      new Map(),
    );
  }

  copy() {
    return new PlayerInfoWidgetSettings(this.widgetId, this.properties);
  }
}
