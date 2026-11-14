import { Flex, Select } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import { AutomationTrigger, useAutomationState } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { useTranslation } from "react-i18next";

export interface VariableValueChangedTriggerValue {
  id: string;
}

const VariableValueChangedTriggerComponent = observer(
  ({ trigger }: { trigger: VariableValueChangedTrigger }) => {
    const { t } = useTranslation();
    const { state } = useAutomationState();

    return (
      <Flex vertical gap={9} className="full-width">
        <LabeledContainer displayName="common-variable">
          <Flex vertical gap={4} className="full-width">
            <Select
              className="full-width"
              value={trigger.value.id}
              options={state.variables.map((variable) => {
                return {
                  label: variable.name,
                  value: variable.id,
                };
              })}
              onChange={(value: string) => {
                const selected = state.variables.find(
                  (variable) => variable.id === value,
                );
                if (selected) {
                  trigger.value = produce(trigger.value, (draft) => {
                    draft.id = selected.id;
                  });
                }
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "var(--oda-secondary-text-color)",
              }}
            >
              {t("automation-variable-changed-hint")}
            </span>
          </Flex>
        </LabeledContainer>
      </Flex>
    );
  },
);

export class VariableValueChangedTrigger
  implements AutomationTrigger, Renderable
{
  private _value: VariableValueChangedTriggerValue = {
    id: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: VariableValueChangedTriggerValue) {
    this._value = { ...this._value, ...(value ?? {}) };
  }

  public get value() {
    return this._value;
  }

  public get name() {
    return "automation-trigger-variable-changed";
  }

  public get id() {
    return "variable-value-changed";
  }

  public get markup() {
    return <VariableValueChangedTriggerComponent trigger={this} />;
  }
}
