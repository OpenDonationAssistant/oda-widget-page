// TODO: позиционирование контента вертикально чтобы поместиться в рамку
import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

import {
  ColorProperty,
  ColorPropertyTarget,
  GRADIENT_TYPE,
} from "../widgetproperties/ColorProperty";

import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../widgetproperties/SingleChoiceProperty";

import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import { DonationGoalLabelProperty } from "../widgetproperties/DonationGoalLabelProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import classes from "./AbstractWidgetSettings.module.css";
import { BackgroundImageProperty } from "../widgetproperties/BackgroundImageProperty";
import { ReactNode } from "react";
import { BoxShadowProperty } from "../widgetproperties/BoxShadowProperty";
import { PaddingProperty } from "../widgetproperties/PaddingProperty";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { HeightProperty } from "../widgetproperties/HeightProperty";
import { WidthProperty } from "../widgetproperties/WidthProperty";
import { DonationGoal } from "../../../pages/DonationGoal/DonationGoal";
import { DemoDonationGoalState } from "../../../pages/DonationGoal/DemoDonationGoalState";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });
    this.addSection({
      key: "goals",
      title: "tab-donationgoal-goals",
      properties: [new DonationGoalProperty()],
    });

    this.addSection({
      key: "general",
      title: "Entire",
      properties: [
        new WidthProperty({
          name: "width",
        }),
        new HeightProperty({
          name: "height",
        }),
        new ColorProperty({
          name: "widgetBackgroundColor",
          displayName: "background-color",
          value: {
            gradient: false,
            angle: 0,
            repeating: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            colors: [{ color: "#FFFFFF00" }],
          },
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({
          name: "backgroundImage",
        }),
        new BorderProperty({
          name: "border",
        }),
        new PaddingProperty({
          name: "padding",
        }),
        new RoundingProperty({
          name: "rounding",
        }),
        new BoxShadowProperty({
          name: "boxShadow",
          displayName: "Тени виджета",
          help: "Устанавливает тени виджета.",
        }),
      ],
    });

    this.addSection({
      key: "header",
      title: "tab-donationgoal-header",
      properties: [
        new BooleanProperty({
          name: "showTitle",
          value: true,
          displayName: "widget-donationgoal-show-title",
        }),
        new SingleChoiceProperty({
          name: "titleTextAlign",
          value: "left",
          displayName: "widget-donationgoal-title-alignment",
          options: ["left", "center", "right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new AnimatedFontProperty({
          name: "descriptionFont",
          label: "widget-donationgoal-title-font-family",
        }),
        new WidthProperty({
          name: "titleWidth",
        }),
        new HeightProperty({
          name: "titleHeight",
        }),
        new ColorProperty({
          name: "titleBackgroundColor",
          displayName: "background-color",
          target: ColorPropertyTarget.BACKGROUND,
          value: {
            gradient: false,
            angle: 0,
            repeating: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            colors: [{ color: "#FFFFFF00" }],
          },
        }),
        new BackgroundImageProperty({
          name: "titleBackgroundImage",
        }),
        new BorderProperty({
          name: "titleBorder",
        }),
        new PaddingProperty({
          name: "titlePadding",
          displayName: "padding",
        }),
        new RoundingProperty({
          name: "titleRounding",
        }),
        new BoxShadowProperty({
          name: "titleBoxShadow",
          displayName: "Тени",
          help: "Устанавливает тени под заголовком(название цели).",
        }),
      ],
    });

    this.addSection({
      key: "progressbar",
      title: "tab-donationgoal-bar",
      properties: [
        new BooleanProperty({
          name: "showLabel",
          value: true,
          displayName: "widget-donationgoal-show-description",
        }),
        new DonationGoalLabelProperty(),
        new SingleChoiceProperty({
          name: "filledTextPlacement",
          value: "center",
          displayName: "Расположение надписи",
          options: ["top", "center", "bottom"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new SingleChoiceProperty({
          name: "filledTextAlign",
          value: "left",
          displayName: "widget-donationgoal-amount-alignment",
          options: ["left", "center", "right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        }),
        new AnimatedFontProperty({
          name: "amountFont",
          label: "widget-donationgoal-amount-font-family",
        }),
        new HeightProperty({
          name: "outerHeight",
        }),
        new ColorProperty({
          name: "backgroundColor",
          displayName: "widget-donationgoal-background",
          target: ColorPropertyTarget.BACKGROUND,
        }),
        new BackgroundImageProperty({
          name: "outerImage",
        }),
        new BorderProperty({
          name: "outerBorder",
        }),
        new RoundingProperty({
          name: "outerRounding",
          displayName: "label-outer-rounding",
        }),
        new PaddingProperty({
          name: "barPadding",
        }),
        new BoxShadowProperty({
          name: "outerBoxShadow",
          displayName: "Тени",
        }),
      ],
    });

    this.addSection({
      key: "fulfillment",
      title: "tab-donationgoal-fulfillment",
      properties: [
        new HeightProperty({
          name: "filledHeight",
        }),
        new ColorProperty({
          name: "filledColor",
          displayName: "widget-donationgoal-filled-color",
          target: ColorPropertyTarget.BACKGROUND,
          value: {
            gradient: false,
            angle: 0,
            repeating: false,
            gradientType: GRADIENT_TYPE.LINEAR,
            colors: [{ color: "#00FF00" }],
          },
        }),
        new BackgroundImageProperty({
          name: "innerImage",
        }),
        new BorderProperty({
          name: "innerBorder",
        }),
        new RoundingProperty({
          name: "innerRounding",
          displayName: "label-filled-rounding",
        }),
        new PaddingProperty({
          name: "innerPadding",
          displayName: "padding",
          target: "margin",
        }),
        new BoxShadowProperty({
          name: "innerBoxShadow",
          displayName: "Тени",
        }),
      ],
    });
  }

  public copy(): DonationGoalWidgetSettings {
    const settings = new DonationGoalWidgetSettings();
    settings.sections = this.sections.map((section) => {
      return {
        key: section.key,
        title: section.title,
        properties: section.properties.map((it) => it.copy()),
      };
    });
    return settings;
  }

  public hasDemo() {
    return true;
  }

  public demo() {
    return (
      <Flex className="full-width" vertical justify="center">
        <DonationGoal settings={this} state={new DemoDonationGoalState(this)} />
      </Flex>
    );
  }

  public help(): ReactNode {
    return (
      <>
        <Flex justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Сбор средств"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Позволяет создать цели сбора донатов и отслеживать их выполнение на
          стриме.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              В настройках виджета создать цели с помощью кнопки "Добавить
              цели", добавить им название и описание, задать сумму.
            </li>
            <li>
              Чтобы какая-то цель выбиралась автоматически, в панели цели надо
              включить опцию 'По умолчанию'.
            </li>
            <li>
              Чтобы отобразить прогресс на стриме, в меню виджета скопируйте
              ссылку и встатьте ссылку как Browser Source в OBS поверх картинки
              стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public get goalProperty(): DonationGoalProperty {
    return this.get("goal") as DonationGoalProperty;
  }

  public get width(): WidthProperty {
    return this.get("width") as WidthProperty;
  }

  public get height(): HeightProperty {
    return this.get("height") as HeightProperty;
  }

  public get showLabel(): boolean {
    return this.get("showLabel")?.value ?? true;
  }

  public get showTitle(): boolean {
    return this.get("showTitle")?.value ?? true;
  }

  public get titleFontProperty(): AnimatedFontProperty {
    return this.get("descriptionFont") as AnimatedFontProperty;
  }

  public get titleTextAlign(): "left" | "center" | "right" {
    return this.get("titleTextAlign")?.value || "left";
  }

  public get titleWidth(): WidthProperty {
    return this.get("titleWidth") as WidthProperty;
  }

  public get titleHeight(): HeightProperty {
    return this.get("titleHeight") as HeightProperty;
  }

  public get titleBorderProperty(): BorderProperty {
    return this.get("titleBorder") as BorderProperty;
  }

  public get titlePaddingProperty(): PaddingProperty {
    return this.get("titlePadding") as PaddingProperty;
  }

  public get titleRoundingProperty(): RoundingProperty {
    return this.get("titleRounding") as RoundingProperty;
  }

  public get titleBackgroundColorProperty(): ColorProperty {
    return this.get("titleBackgroundColor") as ColorProperty;
  }

  public get titleBackgroundImageProperty(): BackgroundImageProperty {
    return this.get("titleBackgroundImage") as BackgroundImageProperty;
  }

  public get titleBoxShadowProperty(): BoxShadowProperty {
    return this.get("titleBoxShadow") as BoxShadowProperty;
  }

  public get paddingProperty(): PaddingProperty {
    return this.get("padding") as PaddingProperty;
  }

  public get roundingProperty(): RoundingProperty {
    return this.get("rounding") as RoundingProperty;
  }

  public get boxShadowProperty(): BoxShadowProperty {
    return this.get("boxShadow") as BoxShadowProperty;
  }

  public get barPadding(): PaddingProperty {
    return this.get("barPadding") as PaddingProperty;
  }

  public get amountFontProperty(): AnimatedFontProperty {
    return this.get("amountFont") as AnimatedFontProperty;
  }

  public get labelTemplate(): string {
    return (
      this.get("labelTemplate")?.value || "<collected> / <required> <currency>"
    );
  }

  public get widgetBackgroundColor(): ColorProperty {
    return this.get("widgetBackgroundColor") as ColorProperty;
  }

  public get backgroundColor(): ColorProperty {
    return this.get("backgroundColor") as ColorProperty;
  }

  public get outerHeight(): HeightProperty {
    return this.get("outerHeight") as HeightProperty;
  }

  public get outerBorderProperty(): BorderProperty {
    return this.get("outerBorder") as BorderProperty;
  }

  public get outerBoxShadowProperty(): BoxShadowProperty {
    return this.get("outerBoxShadow") as BoxShadowProperty;
  }

  public get outerImageProperty(): BackgroundImageProperty {
    return this.get("outerImage") as BackgroundImageProperty;
  }

  public get outerRoundingProperty(): RoundingProperty {
    return this.get("outerRounding") as RoundingProperty;
  }

  public get filledColorProperty(): ColorProperty {
    return this.get("filledColor") as ColorProperty;
  }

  public get filledTextAlign(): "left" | "center" | "right" {
    return this.get("filledTextAlign")?.value || "left";
  }

  public get filledTextPlacement(): "top" | "center" | "bottom" {
    return this.get("filledTextPlacement")?.value || "center";
  }

  public get filledHeight(): HeightProperty {
    return this.get("filledHeight") as HeightProperty;
  }

  public get innerBorderProperty(): BorderProperty {
    return this.get("innerBorder") as BorderProperty;
  }

  public get innerRoundingProperty(): RoundingProperty {
    return this.get("innerRounding") as RoundingProperty;
  }

  public get innerImageProperty(): BackgroundImageProperty {
    return this.get("innerImage") as BackgroundImageProperty;
  }

  public get innerBoxShadowProperty(): BoxShadowProperty {
    return this.get("innerBoxShadow") as BoxShadowProperty;
  }

  public get innerPaddingProperty(): PaddingProperty {
    return this.get("innerPadding") as PaddingProperty;
  }

  public get borderProperty(): BorderProperty {
    return this.get("border") as BorderProperty;
  }

  public get backgroundImage(): BackgroundImageProperty {
    return this.get("backgroundImage") as BackgroundImageProperty;
  }
}
