import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../widgetproperties/ColorProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ReelItemBackgroundProperty } from "../widgetproperties/ReelItemBackgroundProperty";
import { ReelItemListProperty } from "../widgetproperties/ReelItemListProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "tab-reel-general",
          properties: [
            new NumberProperty({
              name: "requiredAmount",
              value: 100,
              displayName: "widget-reel-required-amount",
            }),
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new BorderProperty({
              name: "widgetBorder",
            }),
            new BorderProperty({
              name: "cardBorder",
            }),
            new ColorProperty({
              name: "selectionColor",
              displayName: "widget-reel-background-color",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new NumberProperty({
              name: "perView",
              value: 5,
              displayName: "widget-reel-displayed-amount",
            }),
            new NumberProperty({
              name: "speed",
              value: 250,
              displayName: "widget-reel-turning-time",
            }),
            new NumberProperty({
              name: "time",
              value: 10,
              displayName: "widget-reel-waiting-time",
            }),
          ],
        },
        {
          key: "prizes",
          title: "tab-reel-prizes",
          properties: [
            new ReelItemListProperty(),
            new ReelItemBackgroundProperty(),
          ],
        },
      ],
    });
  }
}
