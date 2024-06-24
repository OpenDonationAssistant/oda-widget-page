import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonationGoalProperty.module.css";
import { log } from "../../../logging";
import { uuidv7 } from "uuidv7";
import BooleanPropertyInput from "../settings/properties/BooleanPropertyInput";
import { Collapse } from "antd";
import TextPropertyModal from "./TextPropertyModal";
import { Trans } from "react-i18next";
import { NumberProperty } from "./NumberProperty";

export interface Amount {
  major: number;
  currency: string;
}

export interface Goal {
  id: string;
  briefDescription: string;
  fullDescription: string;
  default: boolean;
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
          briefDescription: "",
          fullDescription: "",
          default: false,
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
    const updated = (this.value as Goal[]).map((it) => {
      it.default = false;
      return it;
    });
    updated.splice(index, 1, goal);
    log.debug({ goals: this.value }, "goals after update");
    updateConfig(this.widgetId, "goal", updated);
  }

  addGoal(updateConfig: Function) {
    log.debug({ settings: this }, "adding goal to");
    (this.value as Goal[]).push({
      id: uuidv7(),
      briefDescription: "Название",
      fullDescription: "Полное описание",
      default: false,
      requiredAmount: { major: 100, currency: "RUB" },
      accumulatedAmount: { major: 0, currency: "RUB" },
    });
    updateConfig(this.widgetId, "goal", this.value);
    log.debug({ settings: this }, "updated goals");
  }

  copy(): DonationGoalProperty {
    return new DonationGoalProperty(this.widgetId, this.value);
  }

  item(goal: Goal, index: number, updateConfig: Function) {
    return (
      <div key={index} className={`${classes.goalcontainer}`}>
        <div className="widget-settings-item">
          <label
            htmlFor={`${this.widgetId}_${index}`}
            className="widget-settings-name"
          >
            <Trans i18nKey="widget-goal-title" />
          </label>
          <TextPropertyModal title="Название">
            <textarea
              className="widget-settings-value"
              value={goal.briefDescription}
              onChange={(e) => {
                const updated = structuredClone(goal);
                updated.briefDescription = e.target.value;
                this.updateGoal(updateConfig, updated, index);
              }}
            />
          </TextPropertyModal>
        </div>
        <div className="widget-settings-item">
          <label
            htmlFor={`${this.widgetId}_${this.name}`}
            className="widget-settings-name"
          >
            <Trans i18nKey="widget-goal-description" />
          </label>
          <TextPropertyModal title="Описание">
            <textarea
              className="widget-settings-value"
              value={goal.fullDescription}
              onChange={(e) => {
                const updated = structuredClone(goal);
                updated.fullDescription = e.target.value;
                this.updateGoal(updateConfig, updated, index);
              }}
            />
          </TextPropertyModal>
        </div>
        {new NumberProperty(
          this.widgetId,
          "goal-amount",
          "number",
          goal.requiredAmount.major,
          "widget-goal-amount",
        ).markup((p1, p2, value) => {
          if (!this.widgetId) {
            return;
          }
          const updated = structuredClone(goal);
          updated.requiredAmount.major = value ?? 0;
          this.updateGoal(updateConfig, updated, index);
        })}
        <div className="widget-settings-item">
          <label
            htmlFor={`${this.widgetId}_${this.name}`}
            className="widget-settings-name"
          >
            <Trans i18nKey="widget-goal-default" />
          </label>
          <BooleanPropertyInput
            onChange={() => {
              const updated = structuredClone(goal);
              updated.default = !updated.default;
              this.updateGoal(updateConfig, updated, index);
            }}
            prop={{
              name: "test",
              type: "predefined",
              value: goal.default,
            }}
          />
        </div>
        <div style={{ textAlign: "right", marginBottom: "20px;" }}>
          <button
            className={`${classes.deletebutton}`}
            onClick={() => {
              this.deleteGoal(updateConfig, index);
            }}
          >
            <Trans i18nKey="button-delete" />
          </button>
        </div>
      </div>
    );
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            className={`${classes.button} oda-btn-default`}
            onClick={() => this.addGoal(updateConfig)}
          >
            <Trans i18nKey="button-add-goal" />
          </button>
        </div>
        <Collapse
          defaultActiveKey={["1"]}
          items={this.value.map((goal: Goal, index: number) => {
            return {
              key: index,
              label: goal.briefDescription,
              children: this.item(goal, index, updateConfig),
            };
          })}
        />
      </>
    );
  }
}
