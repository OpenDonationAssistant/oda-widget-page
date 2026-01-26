import { observer } from "mobx-react-lite";
import { StateMachineContext } from "../../components/Element/StateMachine/StateMachine";
import { AlertsStore } from "../../stores/alerts/TwitchAlertsStore";
import { StateMachineRenderer } from "../../components/Element/StateMachine/StateMachineRenderer";
import { ElementsWidget } from "../../components/Element/ElementsWidget";

export const TwitchAlertsWidget = observer(
  ({ store }: { store: AlertsStore }) => {

    return (
      <>
        {store.alerts.map((alert) => (
          <StateMachineContext.Provider value={alert.state}>
            <StateMachineRenderer>
              <ElementsWidget settings={alert} />
            </StateMachineRenderer>
          </StateMachineContext.Provider>
        ))}
      </>
    );
  },
);
