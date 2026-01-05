import { useContext } from "react";
import {
  VariableDescription,
  VariableStoreContext,
} from "../../../stores/VariableStore";
import { Variable } from "../../../pages/Automation/AutomationState";

export const VariableScope = ({
  children,
  descriptions,
  variables,
}: {
  children: React.ReactNode;
  descriptions?: VariableDescription[];
  variables?: Variable[];
}) => {
  const store = useContext(VariableStoreContext).clone();
  descriptions?.forEach((desc) => store.addVariableDescription(desc));
  variables?.forEach((variable) => store.addVariable(variable));

  return (
    <VariableStoreContext.Provider value={store}>
      {children}
    </VariableStoreContext.Provider>
  );
};
