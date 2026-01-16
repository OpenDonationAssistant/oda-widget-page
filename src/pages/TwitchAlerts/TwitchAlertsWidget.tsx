import { observer } from "mobx-react-lite";
import { TwitchAlertsWidgetSettings } from "./TwitchAlertsWidgetSettings";
import { StateMachineContext } from "../../components/Element/StateMachine/StateMachine";
import { DefaultTwitchAlertsStore } from "./TwitchAlertsStore";
import { StateMachineRenderer } from "../../components/Element/StateMachine/StateMachineRenderer";
import { ElementsWidget } from "../../components/Element/ElementsWidget";

export const TwitchAlertsWidget = observer(
  ({ settings }: { settings: TwitchAlertsWidgetSettings }) => {
    const store = new DefaultTwitchAlertsStore(settings);

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
