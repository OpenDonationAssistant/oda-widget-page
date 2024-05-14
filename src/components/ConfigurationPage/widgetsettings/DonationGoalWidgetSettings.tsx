import { ReactNode } from "react";
import {
  DonationGoalProperty,
  Goal,
} from "../widgetproperties/DonationGoalProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./DonationGoalWidgetSettings.module.css";
import { log } from "../../../logging";
import { uuidv7 } from "uuidv7";
import { FontProperty } from "../widgetproperties/FontProperty";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { ColorProperty } from "../widgetproperties/ColorProperty";

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    super(
      widgetId,
      properties,
      [
        new FontProperty(
          widgetId,
          "titleFont",
          "fontselect",
          "Alice",
          "Шрифт заголовка",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "titleFontSize",
          "number",
          "24",
          "Размер шрифта заголовка",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "titleColor",
          "color",
          "#000000",
          "Цвет заголовка",
          "header",
        ),
        new FontProperty(
          widgetId,
          "filledFont",
          "fontselect",
          "Russo One",
          "Шрифт суммы",
          "header",
        ),
        new NumberProperty(
          widgetId,
          "filledFontSize",
          "number",
          "24",
          "Размер шрифта суммы",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledTextColor",
          "color",
          "#ffffff",
          "Цвет суммы",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "backgroundColor",
          "color",
          "#818181",
          "Цвет фона полоски",
          "header",
        ),
        new ColorProperty(
          widgetId,
          "filledColor",
          "color",
          "#00aa00",
          "Цвет заполненной части",
          "header",
        ),
        new DonationGoalProperty(widgetId),
      ],
      tabs,
    );
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }

  addGoal(updateConfig: Function) {
    log.debug({ settings: this }, "adding goal to");
    const goal =
      this.properties.find((it) => it.name == "goal") ??
      new DonationGoalProperty(this.widgetId);
    log.debug({ goal: goal }, "updating goal");
    (goal.value as Goal[]).push({
      id: uuidv7(),
      briefDescription: "Название",
      fullDescription: "Полное описание",
      requiredAmount: { major: 100, currency: "RUB" },
      accumulatedAmount: { major: 0, currency: "RUB" },
    });
    updateConfig(this.widgetId, "goal", goal.value);
    log.debug({ settings: this }, "updated goal widget settings");
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <button
          className={`widget-button ${classes.button}`}
          onClick={() => this.addGoal(updateConfig)}
        >
          Добавить цель
        </button>
        {super.markup(updateConfig)}
      </>
    );
  }
}
