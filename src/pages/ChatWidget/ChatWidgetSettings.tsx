import { Flex } from "antd";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { ReactNode } from "react";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { ChatWidget } from "./ChatWidget";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { DemoChatWidgetStore } from "./ChatWidgetStore";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../components/ConfigurationPage/widgetproperties/BoxShadowProperty";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { SELECTION_TYPE, SingleChoiceProperty } from "../../components/ConfigurationPage/widgetproperties/SingleChoiceProperty";

export class ChatWidgetSettings extends AbstractWidgetSettings {
  private _totalWidth: WidthProperty = new WidthProperty({
    name: "width",
    displayName: "Ширина",
  });
  private _totalHeight: HeightProperty = new HeightProperty({
    name: "height",
    displayName: "Высота",
  });

  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "widget",
      title: "Весь виджет",
      properties: [
        this._totalWidth,
        this._totalHeight,
        new ColorProperty({
          name: "totalBackgroundColor",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          displayName: "widget-donaterslist-list-background-color",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "totalBackgroundImage" }),
        new BorderProperty({
          name: "totalBorder",
        }),
        new RoundingProperty({ name: "totalRounding" }),
        new PaddingProperty({ name: "totalPadding" }),
        new BoxShadowProperty({ name: "totalBoxShadow" }),
      ],
    });

    this.addSection({
      key: "message-line",
      title: "Строка сообщения",
      properties: [
        new SingleChoiceProperty({
          name: "layout",
          value: "vertical",
          displayName: "Расположение сообщений",
          options: ["vertical", "horizontal"],
        }),
        new SingleChoiceProperty({
          name: "alignment",
          value: "left",
          displayName: "Выравнивание",
          options: ["left", "center", "right"],
        }),
        new SingleChoiceProperty({
          name: "lineType",
          value: "one-line",
          displayName: "Иконки, никнейм и текст сообщения",
          options: ["separate-blocks", "one-line"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new NumberProperty({
          name: "totalGap",
          value: 3,
          displayName: "Отступ между сообщениями/строками",
          addon: "px",
        }),
        new NumberProperty({
          name: "lineGap",
          value: 3,
          displayName: "Отступ между ником и текстом сообщения",
          addon: "px",
        }),
        new ColorProperty({
          name: "lineBackgroundColor",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          displayName: "widget-donaterslist-list-background-color",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "lineBackgroundImage" }),
        new BorderProperty({
          name: "lineBorder",
        }),
        new RoundingProperty({ name: "lineRounding" }),
        new PaddingProperty({ name: "linePadding" }),
        new BoxShadowProperty({ name: "lineBoxShadow" }),
      ],
    });

    this.addSection({
      key: "author",
      title: "Никнейм",
      properties: [
        new AnimatedFontProperty({
          name: "authorFont",
        }),
        new ColorProperty({
          name: "authorBackgroundColor",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          displayName: "widget-donaterslist-list-background-color",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "authorBackgroundImage" }),
        new BorderProperty({
          name: "authorWidgetBorder",
        }),
        new RoundingProperty({ name: "authorRounding" }),
        new PaddingProperty({ name: "authorPadding" }),
        new BoxShadowProperty({ name: "authorBoxShadow" }),
      ],
    });

    this.addSection({
      key: "message",
      title: "Сообщение",
      properties: [
        new AnimatedFontProperty({
          name: "messageFont",
        }),
        new ColorProperty({
          name: "messageBackgroundColor",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          displayName: "widget-donaterslist-list-background-color",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "messageBackgroundImage" }),
        new BorderProperty({
          name: "messageWidgetBorder",
        }),
        new RoundingProperty({ name: "messageRounding" }),
        new PaddingProperty({ name: "messagePadding" }),
        new BoxShadowProperty({ name: "messageBoxShadow" }),
      ],
    });
  }

  public get isBlock(){
    return this.get("lineType")?.value === "separate-blocks";
  }

  public get widthProperty(): WidthProperty {
    return this._totalWidth;
  }

  public get heightProperty(): HeightProperty {
    return this._totalHeight;
  }

  public get totalBackgroundColor(): ColorProperty {
    return this.get("totalBackgroundColor") as ColorProperty;
  }

  public get totalBackgroundImage(): BackgroundImageProperty {
    return this.get("totalBackgroundImage") as BackgroundImageProperty;
  }

  public get totalBorder(): BorderProperty {
    return this.get("totalBorder") as BorderProperty;
  }

  public get totalRounding(): RoundingProperty {
    return this.get("totalRounding") as RoundingProperty;
  }

  public get totalPadding(): PaddingProperty {
    return this.get("totalPadding") as PaddingProperty;
  }

  public get totalBoxShadow(): BoxShadowProperty {
    return this.get("totalBoxShadow") as BoxShadowProperty;
  }

  public get layout(): "vertical" | "horizontal" {
    return this.get("layout")?.value;
  }

  public get alignment(): "left" | "center" | "right" {
    return this.get("alignment")?.value;
  }

  public get totalGap(): number {
    return this.get("totalGap")?.value;
  }

  public get lineGap(): number {
    return this.get("lineGap")?.value;
  }

  public get lineBackgroundColor(): ColorProperty {
    return this.get("lineBackgroundColor") as ColorProperty;
  }

  public get lineBackgroundImage(): BackgroundImageProperty {
    return this.get("lineBackgroundImage") as BackgroundImageProperty;
  }

  public get lineBorder(): BorderProperty {
    return this.get("lineBorder") as BorderProperty;
  }

  public get lineRounding(): RoundingProperty {
    return this.get("lineRounding") as RoundingProperty;
  }

  public get linePadding(): PaddingProperty {
    return this.get("linePadding") as PaddingProperty;
  }

  public get lineBoxShadow(): BoxShadowProperty {
    return this.get("lineBoxShadow") as BoxShadowProperty;
  }

  public get authorFont(): AnimatedFontProperty {
    return this.get("authorFont") as AnimatedFontProperty;
  }

  public get authorBackgroundColor(): ColorProperty {
    return this.get("authorBackgroundColor") as ColorProperty;
  }

  public get authorBackgroundImage(): BackgroundImageProperty {
    return this.get("authorBackgroundImage") as BackgroundImageProperty;
  }

  public get authorWidgetBorder(): BorderProperty {
    return this.get("authorWidgetBorder") as BorderProperty;
  }

  public get authorRounding(): RoundingProperty {
    return this.get("authorRounding") as RoundingProperty;
  }

  public get authorPadding(): PaddingProperty {
    return this.get("authorPadding") as PaddingProperty;
  }

  public get authorBoxShadow(): BoxShadowProperty {
    return this.get("authorBoxShadow") as BoxShadowProperty;
  }

  public get messageFont(): AnimatedFontProperty {
    return this.get("messageFont") as AnimatedFontProperty;
  }

  public get messageBackgroundColor(): ColorProperty {
    return this.get("messageBackgroundColor") as ColorProperty;
  }

  public get messageBackgroundImage(): BackgroundImageProperty {
    return this.get("messageBackgroundImage") as BackgroundImageProperty;
  }

  public get messageWidgetBorder(): BorderProperty {
    return this.get("messageWidgetBorder") as BorderProperty;
  }

  public get messageRounding(): RoundingProperty {
    return this.get("messageRounding") as RoundingProperty;
  }

  public get messagePadding(): PaddingProperty {
    return this.get("messagePadding") as PaddingProperty;
  }

  public get messageBoxShadow(): BoxShadowProperty {
    return this.get("messageBoxShadow") as BoxShadowProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Чат"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Виджет для отображения общего чата с Twitch, Kick, VKLive
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Canvas) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public hasDemo() {
    return true;
  }

  public demo() {
    return <ChatWidget store={new DemoChatWidgetStore()} settings={this} />;
  }
}
