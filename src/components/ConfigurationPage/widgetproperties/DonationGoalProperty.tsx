import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonationGoalProperty.module.css";
import { log } from "../../../logging";
import { uuidv7 } from "uuidv7";

export interface Amount {
  major: number;
  currency: string;
}

export interface Goal {
  id: string;
  briefDescription: string;
  fullDescription: string;
  requiredAmount: Amount;
  accumulatedAmount: Amount;
}

export class DonationGoalProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value?: Goal[]) {
    super(
      widgetId,
      "goal",
      "predefined",
      value ?? [
        {
          id: uuidv7(),
          briefDescription: "test",
          fullDescription: "full",
          requiredAmount: { major: 100, currency: "RUB" },
        },
      ],
      "Цель",
      "goals",
    );
  }

  deleteGoal(updateConfig: Function, index: number) {
    log.debug("deleting goal");
    (this.value as Goal[]).splice(index, 1);
    updateConfig(this.widgetId, "goal", this.value);
  }

  updateGoal(updateConfig: Function, goal: Goal, index: number) {
    log.debug(
      { goals: this.value, updated: goal, index: index },
      "goals before update",
    );
    (this.value as Goal[]).splice(index, 1, goal);
    log.debug({ goals: this.value }, "goals after update");
    updateConfig(this.widgetId, "goal", this.value);
  }

  addGoal(updateConfig: Function) {
    log.debug({ settings: this }, "adding goal to");
    (this.value as Goal[]).push({
      id: uuidv7(),
      briefDescription: "Название",
      fullDescription: "Полное описание",
      requiredAmount: { major: 100, currency: "RUB" },
      accumulatedAmount: { major: 0, currency: "RUB" },
    });
    updateConfig(this.widgetId, "goal", this.value);
    log.debug({ settings: this }, "updated goals");
  }

  copy(): DonationGoalProperty {
    return new DonationGoalProperty(this.widgetId, this.value);
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
        {this.value.map((goal: Goal, index: number) => (
          <div key={index} className={`${classes.goalcontainer}`}>
            <div style={{ fontStyle: "italic", fontWeight: "900"}}>Цель:</div>
            <div className="widget-settings-item">
              <label
                htmlFor={`${this.widgetId}_${index}`}
                className="widget-settings-name"
              >
                Название
              </label>
              <div className="textarea-container">
                <textarea
                  style={{ width: "50%" }}
                  className="widget-settings-value"
                  value={goal.briefDescription}
                  onChange={(e) => {
                    const updated = structuredClone(goal);
                    updated.briefDescription = e.target.value;
                    this.updateGoal(updateConfig, updated, index);
                  }}
                />
              </div>
            </div>
            <div className="widget-settings-item">
              <label
                htmlFor={`${this.widgetId}_${this.name}`}
                className="widget-settings-name"
              >
                Описание
              </label>
              <div className="textarea-container">
                <textarea
                  style={{ width: "50%" }}
                  className="widget-settings-value"
                  value={goal.fullDescription}
                  onChange={(e) => {
                    const updated = structuredClone(goal);
                    updated.fullDescription = e.target.value;
                    this.updateGoal(updateConfig, updated, index);
                  }}
                />
              </div>
            </div>
            <div className="widget-settings-item">
              <label
                htmlFor={`${this.widgetId}_${this.name}`}
                className="widget-settings-name"
              >
                Сумма
              </label>
              <div className="textarea-container">
                <input
                  className="widget-settings-value"
                  value={goal.requiredAmount.major}
                  onChange={(e) => {
                    const updated = structuredClone(goal);
                    updated.requiredAmount.major = Number.parseInt(e.target.value);
                    this.updateGoal(updateConfig, updated, index);
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                className="widget-button"
                onClick={(e) => {
                  this.deleteGoal(updateConfig, index);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }
}
