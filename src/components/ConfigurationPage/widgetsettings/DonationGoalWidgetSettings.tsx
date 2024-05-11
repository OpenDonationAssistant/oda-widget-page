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

export class DonationGoalWidgetSettings extends AbstractWidgetSettings {
  constructor(widgetId: string, properties: WidgetProperty[]) {
    const tabs = new Map();
    super(widgetId, properties, [new DonationGoalProperty(widgetId)], tabs);
  }

  copy() {
    return new DonationGoalWidgetSettings(this.widgetId, this.properties);
  }

  addGoal(updateConfig: Function) {
    log.debug({ settings: this }, "adding goal to");
    const goal = (
      this.properties.find(it => it.name == "goal") ?? new DonationGoalProperty(this.widgetId)
    );
    log.debug({ goal: goal}, "updating goal");
    (goal.value as Goal[]).push({
      id: uuidv7(),
      briefDescription: "Название",
      fullDescription: "Полное описание",
      requiredAmount: { major: 100, currency: "RUB" },
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
