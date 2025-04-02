import { Flex, Select } from "antd";
import { Renderable } from "../../../utils";
import { AutomationAction, AutomationStateContext } from "../AutomationState";
import InputNumber from "../../../components/ConfigurationPage/components/InputNumber";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { log } from "../../../logging";
import { makeAutoObservable, toJS } from "mobx";

const IncreaseVariableActionComponent = observer(
  ({ action }: { action: IncreaseVariableAction }) => {
    const state = useContext(AutomationStateContext);

    return (
      <Flex vertical gap={9}>
        <Select
          value={action.value.id}
          className="full-width"
          options={state.variables.map((variable) => {
            return {
              label: variable.name,
              value: variable.id,
            };
          })}
          onChange={(value) => {
            log.debug(
              { variables: toJS(state.variables), value: value },
              "selecting variable",
            );
            const selected = state.variables
              .filter((variable) => variable.id === value)
              .at(0);
            if (selected) {
              action.setVariableName(selected.name);
              action.setVariableId(selected.id);
            }
          }}
        />
        <InputNumber
          value={action.value.value}
          onChange={(value) => action.setVariableIncrement(value)}
        />
      </Flex>
    );
  },
);

export interface IncreaseVariableActionValue {
  id: string;
  name: string;
  value: number;
}

export class IncreaseVariableAction implements AutomationAction, Renderable {
  private _value: IncreaseVariableActionValue = {
    id: "",
    name: "",
    value: 1,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public setVariableName(name: string) {
    this._value.name = name;
  }

  public setVariableIncrement(inc: number) {
    this._value.value = inc;
  }

  public setVariableId(id: string) {
    this._value.id = id;
  }

  public set value(value: IncreaseVariableActionValue){
    this._value = value;
  }

  public get value(): IncreaseVariableActionValue {
    return this._value;
  }

  public get id() {
    return "increase-variable";
  }

  public get name() {
    return "Увеличить переменную";
  }

  public get markup() {
    return <IncreaseVariableActionComponent action={this} />;
  }
}
