import {
  VariableDescription,
  VariableStoreContext,
  useVariableStore,
} from "../../../stores/VariableStore";
import { Variable } from "../../../pages/Automation/AutomationState";
import { ObjectWrapper } from "../../../utils";

export const VariableScope = ({
  children,
  descriptions,
  variables,
}: {
  children: React.ReactNode;
  descriptions?: VariableDescription[];
  variables?: Variable[];
}) => {
  const store = useVariableStore().variablesStore.clone();
  descriptions?.forEach((desc) => store?.addVariableDescription(desc));
  variables?.forEach((variable) => store?.addVariable(variable));

  return (
    <VariableStoreContext.Provider value={new ObjectWrapper(store)}>
      {children}
    </VariableStoreContext.Provider>
  );
};
