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
      undefined,
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

  copy(): DonationGoalProperty {
    return new DonationGoalProperty(this.widgetId, this.value);
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        {this.value.map((goal: Goal, index: number) => (
          <div key={index} className={`${classes.goalcontainer}`}>
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
                style={{ width: "unset" }}
                onClick={(e) => {
                  this.deleteGoal(updateConfig, index);
                }}
              >
                Удалить цель
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }
}
