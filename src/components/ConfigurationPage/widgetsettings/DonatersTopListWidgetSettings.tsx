import { ReactNode } from "react";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";
import { DonatersTopListCarouselProperty } from "../widgetproperties/DonatersTopListCarouselProperty";
import { DonatersTopListLayoutProperty } from "../widgetproperties/DonatersTopListLayoutProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { BoxShadowProperty } from "../widgetproperties/BoxShadowProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { BackgroundImageProperty } from "../widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../widgetproperties/WidthProperty";
import { HeightProperty } from "../widgetproperties/HeightProperty";
import { DonatersTopList } from "../../../pages/DonatersTopList/DonatersTopList";
import { DemoListStore } from "../../../pages/DonatersTopList/DemoListStore";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";

export class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "content",
      title: "tab-donaters-list-content",
      properties: [
        new SingleChoiceProperty({
          name: "type",
          value: "Top",
          displayName: "widget-donaterslist-widget-type",
          options: ["Top", "Last"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new SingleChoiceProperty({
          name: "period",
          value: "month",
          displayName: "widget-donaterslist-period",
          options: ["month", "day"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new NumberProperty({
          name: "topsize",
          value: 3,
          displayName: "widget-donaterslist-donaters-amount",
        }),
        new BooleanProperty({
          name: "hideEmpty",
          value: false,
          displayName: "widget-donaterslist-hide-empty",
        }),
      ],
    });
    this.addSection({
      key: "global",
      title: "tab-donaters-list-global",
      properties: [
        new WidthProperty({ name: "width" }),
        new HeightProperty({ name: "height" }),
        new ColorProperty({
          name: "backgroundColor",
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
        new BackgroundImageProperty({ name: "backgroundImage" }),
        new BorderProperty({
          name: "widgetBorder",
        }),
        new RoundingProperty({ name: "rounding" }),
        new PaddingProperty({ name: "padding" }),
        new BoxShadowProperty({ name: "boxShadow" }),
      ],
    });
    this.addSection({
      key: "header",
      title: "tab-donaters-list-title",
      properties: [
        new BooleanProperty({
          name: "showHeader",
          value: true,
          displayName: "widget-donaterslist-show-header",
        }),
        new TextProperty({
          name: "title",
          value: "Донатеры ",
          displayName: "widget-donaterslist-title",
        }),
        new AnimatedFontProperty({
          name: "headerFont",
        }),
        new SingleChoiceProperty({
          name: "headerAlignment",
          value: "Center",
          displayName: "widget-donaterslist-list-alignment",
          options: ["Left", "Center", "Right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new WidthProperty({ name: "headerWidth" }),
        new HeightProperty({ name: "headerHeight" }),
        new ColorProperty({
          name: "titleBackgroundColor",
          displayName: "widget-donaterslist-title-background-color",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({
          name: "headerBackgroundImage",
        }),
        new BorderProperty({
          name: "headerBorder",
        }),
        new RoundingProperty({
          name: "headerRounding",
        }),
        new PaddingProperty({
          name: "headerPadding",
        }),
        new BoxShadowProperty({
          name: "headerBoxShadow",
        }),
      ],
    });
    this.addSection({
      key: "list",
      title: "tab-donaters-list-list",
      properties: [
        new NumberProperty({
          name: "gap",
          value: 0,
          addon: "px",
          displayName: "widget-donaterslist-gap",
        }),
        new WidthProperty({ name: "listWidth" }),
        new HeightProperty({ name: "listHeight" }),
        new ColorProperty({
          name: "listBackgroundColor",
          displayName: "widget-donaterslist-list-background-color",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "listBackgroundImage" }),
        new BorderProperty({
          name: "listBorder",
        }),
        new RoundingProperty({
          name: "listRounding",
        }),
        new PaddingProperty({
          name: "listPadding",
        }),
        new BoxShadowProperty({
          name: "listBoxShadow",
        }),
      ],
    });
    this.addSection({
      key: "list-item",
      title: "tab-donaters-list-item",
      properties: [
        new WidthProperty({ name: "itemWidth" }),
        new HeightProperty({ name: "itemHeight" }),
        new ColorProperty({
          name: "itemBackgroundColor",
          displayName: "background-color",
          value: {
            gradient: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            repeating: false,
            colors: [{ color: "rgba(0,0,0,0)" }],
            angle: 0,
          },
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({ name: "itemBackgroundImage" }),
        new AnimatedFontProperty({
          name: "messageFont",
        }),
        new SingleChoiceProperty({
          name: "listAlignment",
          value: "Center",
          displayName: "widget-donaterslist-list-alignment",
          options: ["Left", "Center", "Right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new BorderProperty({
          name: "itemBorder",
          displayName: "border",
        }),
        new RoundingProperty({
          name: "itemRounding",
        }),
        new PaddingProperty({
          name: "itemPadding",
        }),
        new BoxShadowProperty({
          name: "itemBoxShadow",
        }),
      ],
    });
    this.addSection({
      key: "layout",
      title: "tab-donaters-list-style",
      properties: [
        new DonatersTopListLayoutProperty(),
        new DonatersTopListCarouselProperty(),
      ],
    });
  }

  public get type(): "Top" | "Last" {
    return this.get("type")?.value;
  }

  public get period(): "month" | "day" {
    return this.get("period")?.value;
  }

  public get topsize(): number {
    return this.get("topsize")?.value;
  }

  public get hideEmpty(): boolean {
    return this.get("hideEmpty")?.value;
  }

  public get title(): string {
    return this.get("title")?.value;
  }

  public get heightProperty(): HeightProperty {
    return this.get("height") as HeightProperty;
  }

  public get widthProperty(): WidthProperty {
    return this.get("width") as WidthProperty;
  }

  public get backgroundColor(): ColorProperty {
    return this.get("backgroundColor") as ColorProperty;
  }

  public get backgroundImage(): BackgroundImageProperty {
    return this.get("backgroundImage") as BackgroundImageProperty;
  }

  public get rounding(): RoundingProperty {
    return this.get("rounding") as RoundingProperty;
  }

  public get padding(): PaddingProperty {
    return this.get("padding") as PaddingProperty;
  }

  public get boxShadow(): BoxShadowProperty {
    return this.get("boxShadow") as BoxShadowProperty;
  }

  public get widgetBorder(): BorderProperty {
    return this.get("widgetBorder") as BorderProperty;
  }

  public get headerWidth(): WidthProperty {
    return this.get("headerWidth") as WidthProperty;
  }

  public get headerHeight(): HeightProperty {
    return this.get("headerHeight") as HeightProperty;
  }

  public get headerFont(): AnimatedFontProperty {
    return this.get("headerFont") as AnimatedFontProperty;
  }

  public get headerAlignment(): "left" | "center" | "right" {
    return this.get("headerAlignment")?.value.toLowerCase() as
      | "left"
      | "center"
      | "right";
  }

  public get titleBackgroundColor(): ColorProperty {
    return this.get("titleBackgroundColor") as ColorProperty;
  }

  public get showHeader(): boolean {
    return this.get("showHeader")?.value;
  }

  public get headerBackgroundImage(): BackgroundImageProperty {
    return this.get("headerBackgroundImage") as BackgroundImageProperty;
  }

  public get headerBorder(): BorderProperty {
    return this.get("headerBorder") as BorderProperty;
  }

  public get headerRounding(): RoundingProperty {
    return this.get("headerRounding") as RoundingProperty;
  }

  public get headerPadding(): PaddingProperty {
    return this.get("headerPadding") as PaddingProperty;
  }

  public get headerBoxShadow(): BoxShadowProperty {
    return this.get("headerBoxShadow") as BoxShadowProperty;
  }

  public get gap(): number {
    return this.get("gap")?.value;
  }

  public get messageFont(): AnimatedFontProperty {
    return this.get("messageFont") as AnimatedFontProperty;
  }

  public get listWidth(): WidthProperty {
    return this.get("listWidth") as WidthProperty;
  }

  public get listHeight(): HeightProperty {
    return this.get("listHeight") as HeightProperty;
  }

  public get listAlignment(): "Left" | "Center" | "Right" {
    return this.get("listAlignment")?.value;
  }

  public get listBackgroundColor(): ColorProperty {
    return this.get("listBackgroundColor") as ColorProperty;
  }

  public get listBackgroundImage(): BackgroundImageProperty {
    return this.get("listBackgroundImage") as BackgroundImageProperty;
  }

  public get listBorder(): BorderProperty {
    return this.get("listBorder") as BorderProperty;
  }

  public get listRounding(): RoundingProperty {
    return this.get("listRounding") as RoundingProperty;
  }

  public get listPadding(): PaddingProperty {
    return this.get("listPadding") as PaddingProperty;
  }

  public get listBoxShadow(): BoxShadowProperty {
    return this.get("listBoxShadow") as BoxShadowProperty;
  }

  public get itemHeight(): HeightProperty {
    return this.get("itemHeight") as HeightProperty;
  }

  public get itemWidth(): WidthProperty {
    return this.get("itemWidth") as WidthProperty;
  }

  public get itemBorder(): BorderProperty {
    return this.get("itemBorder") as BorderProperty;
  }

  public get itemRounding(): RoundingProperty {
    return this.get("itemRounding") as RoundingProperty;
  }

  public get itemPadding(): PaddingProperty {
    return this.get("itemPadding") as PaddingProperty;
  }

  public get itemBoxShadow(): BoxShadowProperty {
    return this.get("itemBoxShadow") as BoxShadowProperty;
  }

  public get itemBackgroundColor(): ColorProperty {
    return this.get("itemBackgroundColor") as ColorProperty;
  }

  public get itemBackgroundImage(): BackgroundImageProperty {
    return this.get("itemBackgroundImage") as BackgroundImageProperty;
  }

  public get layout(): "horizontal" | "vertical" {
    return this.get("layout")?.value;
  }

  public get carousel(): DonatersTopListCarouselProperty {
    return this.get("carousel") as DonatersTopListCarouselProperty;
  }

  public hasDemo() {
    return true;
  }

  public demo() {
    return <DonatersTopList settings={this} store={new DemoListStore()} />;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Список донатеров"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Отображает информацию про донатеров - топ за выбранный период (день,
          месяц) или последние
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
