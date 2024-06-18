import { NumberProperty } from "../widgetproperties/NumberProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class MediaWidgetSettings extends AbstractWidgetSettings {

  constructor(widgetId: string, properties: WidgetProperty[]) {
    super(
      widgetId,
      properties,
      [
        new NumberProperty(
          widgetId,
          "playlistSongTitleFontSize",
          "number",
          "16",
          "widget-media-title-font-size"
        ),
        new NumberProperty(
          widgetId,
          "playlistNicknameFontSize",
          "number",
          "16",
          "widget-media-customer-font-size"
        ),
      ],
      new Map(),
    );
  }

  copy() {
    return new MediaWidgetSettings(this.widgetId, this.properties);
  }
}
