import { observer } from "mobx-react-lite";
import { ReactNode, useContext } from "react";
import { RepeaterElementSettings } from "./RepeaterElement";
import { VariableStoreContext } from "../../../stores/VariableStore";
import { Variable } from "../../../pages/Automation/AutomationState";
import { VariableScope } from "../../ConfigurationPage/widgetsettings/VariableScope";

export const RepeaterElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: ReactNode;
    settings: RepeaterElementSettings;
  }) => {
    const scope = useContext(VariableStoreContext);

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
              <VariableStoreContext.Provider value={newScope}>
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
