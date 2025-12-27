import { useContext, useEffect } from "react";
import { log } from "../../logging";
import { DonatonWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import { observer } from "mobx-react-lite";
import { VariableStoreContext } from "../../stores/VariableStore";
import { uuidv7 } from "uuidv7";
import { ElementRenderer } from "../../components/Element/ElementRenderer";

export const DonatonWidget = observer(
  ({ settings }: { settings: DonatonWidgetSettings }) => {
    const variables = useContext(VariableStoreContext);

    // TODO: or ahooks?
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (!settings.timerEndProperty.value.timestamp) {
          return;
        }
        log.debug({ endTime: settings.timerEndProperty.value.timestamp });
        const now = Date.now();
        const end = Date.parse(`${settings.timerEndProperty.value.timestamp}`);
        const difference = end - now;
        if (difference < 0) {
          variables.addVariable({
            name: "time",
            type: "string",
            value: "00:00:00",
            id: uuidv7(),
          });
          return;
        }
        log.debug({ now: now, end: end, diff: difference });
        const hours = Math.floor(difference / 36e5);
        const minutes = Math.floor((difference % 36e5) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        variables.addVariable({
          name: "time",
          type: "string",
          value: `${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
          id: uuidv7(),
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }, [settings]);

    return (
      <>
        {settings.elements
          .filter((element) => element.data.containerId === null)
          .map((element) => (
            <ElementRenderer element={element} key={element.data.id} />
          ))}
      </>
    );
  },
);
