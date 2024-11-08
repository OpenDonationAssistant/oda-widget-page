import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import {
  ColorProperty,
  ColorPropertyTarget,
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
import { ReactNode } from "react";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "goals",
          title: "tab-donationgoal-goals",
          properties: [new DonationGoalProperty()],
        },
        {
          key: "header",
          title: "tab-donationgoal-header",
          properties: [
            new AnimatedFontProperty({
              name: "descriptionFont",
              label: "widget-donationgoal-title-font-family",
            }),
            new SingleChoiceProperty({
              name: "titleTextAlign",
              value: "left",
              displayName: "widget-donationgoal-title-alignment",
              options: ["left", "center", "right"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new BorderProperty({
              name: "border",
            }),
          ],
        },
        {
          key: "progressbar",
          title: "tab-donationgoal-bar",
          properties: [
            new DonationGoalLabelProperty(),
            new AnimatedFontProperty({
              name: "amountFont",
              label: "widget-donationgoal-amount-font-family",
            }),
            new SingleChoiceProperty({
              name: "filledTextAlign",
              value: "left",
              displayName: "widget-donationgoal-amount-alignment",
              options: ["left", "center", "right"],
              selectionType: SELECTION_TYPE.SEGMENTED,
            }),
            new ColorProperty({
              name: "backgroundColor",
              displayName: "widget-donationgoal-background",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new ColorProperty({
              name: "filledColor",
              displayName: "widget-donationgoal-filled-color",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new BorderProperty({
              name: "outerBorder",
            }),
            new BorderProperty({
              name: "innerBorder",
            }),
            new RoundingProperty({
              name: "innerRounding",
              displayName: "label-filled-rounding",
            }),
            new RoundingProperty({
              name: "outerRounding",
              displayName: "label-outer-rounding",
            }),
          ],
        },
      ],
    });
  }
  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Сбор средств"</h3>
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
}
