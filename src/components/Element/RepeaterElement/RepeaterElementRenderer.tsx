import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { RepeaterElementSettings } from "./RepeaterElement";
import {
  VariableStore,
  VariableStoreContext,
  useVariableStore,
} from "../../../stores/VariableStore";
import { Variable } from "../../../pages/Automation/AutomationState";
import { VariableScope } from "../../ConfigurationPage/widgetsettings/VariableScope";
import { ObjectWrapper } from "../../../utils";

export const RepeaterElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: ReactNode;
    settings: RepeaterElementSettings;
  }) => {
    const scope = useVariableStore().variablesStore;

    const targetVariable = scope.variables.find(
      (variable) => variable.name === settings.target,
    );

    if (!targetVariable) {
      return <>{children}</>;
    }

    if (targetVariable.type === "matrix") {
      return (targetVariable.value as Array<Array<Variable>>).map(
        (row, rowIndex) => {
          return (
            <VariableScope key={rowIndex} variables={row}>
              {children}
            </VariableScope>
          );
        },
      );
    }

    if (targetVariable.type === "list") {
      return (targetVariable.value as Array<Variable>).map(
        (variable, index) => {
          const newScope = scope.clone();
          newScope.addVariable(variable);

          return (
            <div key={index}>
              <VariableStoreContext.Provider
                value={new ObjectWrapper<VariableStore>(newScope)}
              >
                {children}
              </VariableStoreContext.Provider>
            </div>
          );
        },
      );
    }

    return <>{children}</>;
  },
);
