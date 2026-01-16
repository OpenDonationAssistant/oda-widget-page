import { useContext, useEffect, useState } from "react";
import { StateMachine, StateMachineContext } from "./StateMachine";

export const StateMachineRenderer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const stateMachine = useContext(StateMachineContext);
  const [show, setShow] = useState<boolean>(false);
  const nestedState = new StateMachine();

  useEffect(() => {
    stateMachine.addCallback("visible", () => {
      setShow(true);
      return nestedState.goTo("visible");
    });
    stateMachine.addCallback("hidden", () => {
      return nestedState.goTo("hidden").then(() => setShow(false));
    });
  }, [stateMachine]);

  return (
    <StateMachineContext.Provider value={nestedState}>
      <div style={{ display: show ? "initial" : "none" }}>{children}</div>
    </StateMachineContext.Provider>
  );
};
