import { Flex, Input, Select } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import { AutomationTrigger, useAutomationState } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";

export interface VariableEqualsValueTriggerValue {
  id: string;
  name: string;
  value: string;
}

const VariableEqualsValueTriggerComponent = observer(
  ({ trigger }: { trigger: VariableEqualsValueTrigger }) => {
    const { state } = useAutomationState();
    const selectedVariable = state.variables.find(
      (variable) => variable.id === trigger.value.id,
    );

    return (
      <Flex vertical gap={9}>
        <LabeledContainer displayName="Переменная">
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
                  draft.name = selected.name;
                  if (selected.type === "number" && draft.value === "") {
                    draft.value = "0";
                  }
                });
              }
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="Значение">
          {selectedVariable?.type === "number" ? (
            <InputNumber
              value={Number(trigger.value.value) || 0}
              onChange={(value) => {
                trigger.value = produce(trigger.value, (draft) => {
                  draft.value = String(value);
                });
              }}
            />
          ) : (
            <Input
              value={trigger.value.value}
              onChange={(e) => {
                trigger.value = produce(trigger.value, (draft) => {
                  draft.value = e.target.value;
                });
              }}
            />
          )}
        </LabeledContainer>
      </Flex>
    );
  },
);

export class VariableEqualsValueTrigger implements AutomationTrigger, Renderable {
  private _value: VariableEqualsValueTriggerValue = {
    id: "",
    name: "",
    value: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: VariableEqualsValueTriggerValue) {
    this._value = { ...this._value, ...(value ?? {}) };
  }

  public get value() {
    return this._value;
  }

  public get name() {
    return "Переменная равна значению";
  }

  public get id() {
    return "variable-equals-value";
  }

  public get markup() {
    return <VariableEqualsValueTriggerComponent trigger={this} />;
  }
}
