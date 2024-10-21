import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new NumberProperty({
              name: "playlistSongTitleFontSize",
              value: 16,
              displayName: "widget-media-title-font-size",
            }),
            new NumberProperty({
              name: "playlistNicknameFontSize",
              value: 16,
              displayName: "widget-media-customer-font-size",
            }),
          ],
        },
      ],
    });
  }
}
