import { ReactNode, useContext, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonationGoalProperty.module.css";
import { log } from "../../../logging";
import { uuidv7 } from "uuidv7";
import { Flex } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import { PaymentPageConfigContext } from "../../MediaWidget/PaymentPageConfig";
import ArrowUp from "../../../icons/ArrowUp";
import ArrowDown from "../../../icons/ArrowDown";
import CloseIcon from "../../../icons/CloseIcon";
import { BorderedIconButton } from "../../IconButton/IconButton";
import { TextPropertyRawComponent } from "./TextProperty";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import { AddListItemButton, List, ListItem } from "../../List/List";

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
          <TextPropertyRawComponent
            displayName="widget-goal-title"
            value={goal.briefDescription}
            size="small"
            onChange={(e) => {
              const updated = toJS(goal);
              updated.briefDescription = e.target.value;
              property.updateGoal(updated, index);
            }}
          />
        </div>
        <div className="settings-item">
          <TextPropertyRawComponent
            displayName="widget-goal-description"
            value={goal.fullDescription}
            size="small"
            onChange={(e) => {
              const updated = toJS(goal);
              updated.fullDescription = e.target.value;
              property.updateGoal(updated, index);
            }}
          />
        </div>
        <Flex gap={9} className="settings-item">
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
        </Flex>
        <div className="settings-item">
          <LightLabeledSwitchComponent
            value={goal.default}
            onChange={() => {
              const updated = toJS(goal);
              updated.default = !updated.default;
              property.updateGoal(updated, index);
            }}
            label="widget-goal-default"
          />
        </div>
      </div>
    );
  },
);

const DonationGoalItemComponent = observer(
  ({
    property,
    index,
    goal,
  }: {
    property: DonationGoalProperty;
    index: number;
    goal: Goal;
  }) => {
    const [opened, setOpened] = useState<boolean>(false);
    return (
      <Flex vertical className={`${classes.goalitem}`}>
        <ListItem
          first={
            <div className={`${classes.goaltitle}`}>
              {goal.briefDescription}
            </div>
          }
          second={
            <Flex align="center" justify="flex-end" gap={3}>
              <BorderedIconButton onClick={() => property.deleteGoal(index)}>
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
              {opened ? <ArrowUp /> : <ArrowDown />}
            </Flex>
          }
          onClick={() => setOpened(!opened)}
        />
        {opened && (
          <ItemComponent property={property} goal={goal} index={index} />
        )}
      </Flex>
    );
  },
);

const DonationGoalPropertyComponent = observer(
  ({ property }: { property: DonationGoalProperty }) => {
    return (
      <List>
        {property.value.map((goal: Goal, index: number) => (
          <DonationGoalItemComponent
            property={property}
            index={index}
            goal={goal}
          />
        ))}
        <AddListItemButton
          onClick={() => property.addGoal()}
          label="button-add-goal"
        />
      </List>
    );
  },
);

export class DonationGoalProperty extends DefaultWidgetProperty<Goal[]> {
  constructor() {
    super({
      name: "goal",
      value: [
        {
          id: uuidv7(),
          briefDescription: "Название",
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
