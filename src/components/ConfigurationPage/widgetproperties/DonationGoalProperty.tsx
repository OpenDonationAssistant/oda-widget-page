import { ReactNode, useContext } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonationGoalProperty.module.css";
import { log } from "../../../logging";
import { uuidv7 } from "uuidv7";
import { Collapse, Flex } from "antd";
import TextPropertyModal from "./TextPropertyModal";
import { Trans } from "react-i18next";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import BooleanPropertyInput from "../components/BooleanPropertyInput";
import InputNumber from "../components/InputNumber";
import { PaymentPageConfigContext } from "../../MediaWidget/PaymentPageConfig";

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

const ItemComponent = observer(
  ({
    property,
    goal,
    index,
  }: {
    property: DonationGoalProperty;
    goal: Goal;
    index: number;
  }) => {
    const paymentPageConfig = useContext(PaymentPageConfigContext);

    return (
      <div key={index} className={`${classes.goalcontainer}`}>
        <div className="settings-item">
          <LabeledContainer displayName="widget-goal-title">
            <TextPropertyModal title="Название">
              <textarea
                className="widget-settings-value"
                value={goal.briefDescription}
                onChange={(e) => {
                  const updated = toJS(goal);
                  updated.briefDescription = e.target.value;
                  property.updateGoal(updated, index);
                }}
              />
            </TextPropertyModal>
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="widget-goal-description">
            <TextPropertyModal title="Описание">
              <textarea
                className="widget-settings-value"
                value={goal.fullDescription}
                onChange={(e) => {
                  const updated = toJS(goal);
                  updated.fullDescription = e.target.value;
                  property.updateGoal(updated, index);
                }}
              />
            </TextPropertyModal>
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="widget-goal-amount">
            <InputNumber
              value={goal.requiredAmount.major}
              addon="руб."
              onChange={(value) => {
                const updated = toJS(goal);
                updated.requiredAmount.major = value ?? 0;
                property.updateGoal(updated, index);
              }}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="widget-goal-accumulated-amount">
            <InputNumber
              value={
                paymentPageConfig?.goals.filter((g) => g.id === goal.id)[0]
                  ?.accumulatedAmount.major ?? 0
              }
              addon="руб."
              onChange={(value) => {
                const updated = toJS(goal);
                if (!updated.accumulatedAmount) {
                  updated.accumulatedAmount = { major: 0, currency: "RUB" };
                }
                updated.accumulatedAmount.major = value ?? 0;
                if (paymentPageConfig) {
                  const updatedGoal = paymentPageConfig.goals.filter(
                    (g) => g.id === goal.id,
                  )[0];
                  if (updatedGoal) {
                    updatedGoal.accumulatedAmount.major = value ?? 0;
                  } else {
                    paymentPageConfig.goals.push(updated);
                  }
                }
                property.updateGoal(updated, index);
              }}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="widget-goal-default">
            <BooleanPropertyInput
              onChange={() => {
                const updated = toJS(goal);
                updated.default = !updated.default;
                property.updateGoal(updated, index);
              }}
              prop={{
                value: goal.default,
              }}
            />
          </LabeledContainer>
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            className={`${classes.deletebutton}`}
            onClick={() => {
              property.deleteGoal(index);
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">delete</span>
              <div>
                <Trans i18nKey="button-delete" />
              </div>
            </Flex>
          </button>
        </div>
      </div>
    );
  },
);

const DonationGoalPropertyComponent = observer(
  ({ property }: { property: DonationGoalProperty }) => {
    return (
      <>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            className={`${classes.button} oda-btn-default`}
            onClick={() => property.addGoal()}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">add</span>
              <div>
                <Trans i18nKey="button-add-goal" />
              </div>
            </Flex>
          </button>
        </div>
        <Collapse
          defaultActiveKey={["1"]}
          items={property.value.map((goal: Goal, index: number) => {
            return {
              key: index,
              label: goal.briefDescription,
              children: (
                <ItemComponent property={property} goal={goal} index={index} />
              ),
            };
          })}
        />
      </>
    );
  },
);

// TODO: 18n
export class DonationGoalProperty extends DefaultWidgetProperty<Goal[]> {
  constructor() {
    super({
      name: "goal",
      value: [
        {
          id: uuidv7(),
          briefDescription: "",
          fullDescription: "",
          default: false,
          requiredAmount: { major: 100, currency: "RUB" },
          accumulatedAmount: { major: 0, currency: "RUB" },
        },
      ],
      displayName: "Цель",
    });
  }

  copy() {
    return new DonationGoalProperty();
  }

  deleteGoal(index: number) {
    (this.value as Goal[]).splice(index, 1);
  }

  updateGoal(goal: Goal, index: number) {
    const updated = (this.value as Goal[]).map((it) => {
      it.default = false;
      return it;
    });
    updated.splice(index, 1, goal);
    this.value = updated;
  }

  // TODO: 18n
  addGoal() {
    (this.value as Goal[]).push({
      id: uuidv7(),
      briefDescription: "Название",
      fullDescription: "",
      default: false,
      requiredAmount: { major: 100, currency: "RUB" },
      accumulatedAmount: { major: 0, currency: "RUB" },
    });
    log.debug({ settings: this }, "updated goals");
  }

  markup(): ReactNode {
    return <DonationGoalPropertyComponent property={this} />;
  }
}
