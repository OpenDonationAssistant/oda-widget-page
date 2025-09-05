import { ReactNode } from "react";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";

export class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new SingleChoiceProperty({
              name: "widgetType",
              value: "Старый",
              displayName: "Вид виджета",
              options: ["Старый", "Новый"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new ColorProperty({
              name: "background",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              target: ColorPropertyTarget.BACKGROUND,
              displayName: "label-background",
            }),
            new BorderProperty({
              name: "widgetBorder",
            }),
            new RoundingProperty({
              name: "rounding",
            }),
            new PaddingProperty({
              name: "padding",
            }),
          ],
        },
        {
          key: "title",
          title: "title",
          properties: [
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new ColorProperty({
              name: "titleBackground",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              target: ColorPropertyTarget.BACKGROUND,
              displayName: "label-background",
            }),
            new BorderProperty({
              name: "titleBorder",
            }),
            new RoundingProperty({
              name: "titleRounding",
            }),
          ],
        },
        {
          key: "requester",
          title: "requester",
          properties: [
            new SingleChoiceProperty({
              name: "showRequester",
              value: "show",
              displayName: "display-requester",
              options: ["show", "hide"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new AnimatedFontProperty({
              name: "requesterFont",
            }),
            new ColorProperty({
              name: "requesterBackground",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              target: ColorPropertyTarget.BACKGROUND,
              displayName: "label-background",
            }),
            new BorderProperty({
              name: "requesterBorder",
            }),
            new RoundingProperty({
              name: "requesterRounding",
            }),
            new PaddingProperty({
              name: "requesterPadding",
            }),
          ],
        },
        {
          key: "queue",
          title: "queue",
          properties: [
            new SingleChoiceProperty({
              name: "showQueueSize",
              value: "show",
              displayName: "display-queue-size",
              options: ["show", "hide"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new AnimatedFontProperty({
              name: "queueFont",
            }),
            new ColorProperty({
              name: "queueBackground",
              value: {
                gradient: false,
                gradientType: GRADIENT_TYPE.LINEAR,
                repeating: false,
                colors: [{ color: "rgba(0,0,0,0)" }],
                angle: 0,
              },
              target: ColorPropertyTarget.BACKGROUND,
              displayName: "label-background",
            }),
            new BorderProperty({
              name: "queueBorder",
            }),
            new RoundingProperty({
              name: "queueRounding",
            }),
            new PaddingProperty({
              name: "queuePadding",
            }),
          ],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Текущий трек"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Отображает название текущего видео в плеере, кто заказал и сколько
          треков в очереди.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
            <li>Добавить видео в плеер, проверить что виджет отображается.</li>
          </ul>
        </div>
      </>
    );
  }
}
