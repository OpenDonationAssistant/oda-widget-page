import { useContext, useEffect, useState } from "react";
import { StateMachine, StateMachineContext } from "./StateMachine";
import { log } from "../../../logging";

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
      log.debug("go to visible state");
      setShow(true);
      return nestedState.goTo("visible");
    });
    stateMachine.addCallback("hidden", () => {
      log.debug("go to unvisible state");
      return nestedState.goTo("hidden").then(() => setShow(false));
    });
  }, [stateMachine]);

  return (
    <StateMachineContext.Provider value={nestedState}>
      <div style={{ display: show ? "initial" : "none" }}>{children}</div>
    </StateMachineContext.Provider>
  );
};
