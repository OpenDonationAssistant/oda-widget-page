import { log } from "../../../logging";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import { produce } from "immer";
import {
  AnimatedFontProperty,
  DEFAULT_FONT_PROPERTY_VALUE,
} from "../widgetproperties/AnimatedFontProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";

export class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new AnimatedFontProperty({
              widgetId: widgetId,
              name: "nicknameFont",
              label: "widget-payments-title-font",
              tab: "general",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Play";
                draft.size = 24;
                draft.color.colors[0].color = "#FBFFF1";
              }),
            }),
            new AnimatedFontProperty({
              name: "messageFont",
              label: "widget-payments-message-font",
              tab: "general",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Play";
                draft.size = 24;
                draft.color.colors[0].color = "#B4C5E4";
              }),
            }),
            new AnimatedFontProperty({
              name: "musicFont",
              label: "widget-payments-music-font",
              tab: "general",
              value: produce(DEFAULT_FONT_PROPERTY_VALUE, (draft) => {
                draft.family = "Anonymous Pro";
                draft.size = 18;
                draft.color.colors[0].color = "#b39ddb";
              }),
            }),
          ],
        },
      ],
    });
  }
}
