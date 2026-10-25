import { Flex, Input, Select } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";
import { Renderable } from "../../../utils";
import { AutomationAction, useAutomationState } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";

export interface SetVariableValueActionValue {
  id: string;
  name: string;
  value: string;
}

const SetVariableValueActionComponent = observer(
  ({ action }: { action: SetVariableValueAction }) => {
    const { state } = useAutomationState();
    const selectedVariable = state.variables.find(
      (variable) => variable.id === action.value.id,
    );

    return (
      <Flex vertical gap={9}>
        <LabeledContainer displayName="Переменная">
          <Select
            className="full-width"
            value={action.value.id}
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
                action.value = produce(action.value, (draft) => {
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
              value={Number(action.value.value) || 0}
              onChange={(value) => {
                action.value = produce(action.value, (draft) => {
                  draft.value = String(value);
                });
              }}
            />
          ) : (
            <Input
              value={action.value.value}
              onChange={(e) => {
                action.value = produce(action.value, (draft) => {
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

export class SetVariableValueAction implements AutomationAction, Renderable {
  private _value: SetVariableValueActionValue = {
    id: "",
    name: "",
    value: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: SetVariableValueActionValue) {
    this._value = { ...this._value, ...(value ?? {}) };
  }

  public get value() {
    return this._value;
  }

  public get name() {
    return "Установить значение переменной";
  }

  public get id() {
    return "set-variable-value";
  }

  public get markup() {
    return <SetVariableValueActionComponent action={this} />;
  }
}
