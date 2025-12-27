import { useContext, useEffect, useState } from "react";
import { DonationTimerWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { HistoryStore } from "../History/HistoryStore";
import { observer } from "mobx-react-lite";
import { reaction, toJS } from "mobx";
import { log } from "../../logging";
import { ElementRenderer } from "../../components/Element/ElementRenderer";
import { VariableStoreContext } from "../../stores/VariableStore";
import { uuidv7 } from "uuidv7";
import { Variable } from "../Automation/AutomationState";

export const DonationTimer = observer(
  ({
    settings,
    store,
  }: {
    settings: DonationTimerWidgetSettings;
    store: HistoryStore;
  }) => {
    const [lastDonationTime, setLastDonationTime] = useState<Date | null>(null);
    const variables = useContext(VariableStoreContext);

    useEffect(() => {
      setLastDonationTime(new Date());
      if (!settings.resetOnLoad) {
        reaction(
          () => store.items.at(0),
          (item) => {
            log.debug({ item: toJS(item) }, "timer reaction");
            if (item?.timestamp) {
              const date = new Date(item?.timestamp);
              log.debug({ date: date }, "setting timer date");
              setLastDonationTime(date);
            }
          },
        );
      }
    }, [store, settings.resetOnLoad]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (!lastDonationTime) {
          return;
        }
        const now = Date.now();
        const difference = now - lastDonationTime.getTime();
        const days = Math.floor(difference / (24 * 36e5));
        const hours = Math.floor((difference % (24 * 36e5)) / 36e5);
        const minutes = Math.floor((difference % 36e5) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        const time = `${days > 0 ? days + "D " : ""}${hours < 10 ? "0" + hours : hours}:${
          minutes < 10 ? "0" + minutes : minutes
        }:${seconds < 10 ? "0" + seconds : seconds}`;
        const timeVariable = {
          name: "time",
          type: "string",
          value: time,
          id: uuidv7(),
        } as Variable;

        variables.addVariable(timeVariable);
      }, 1000);
      return () => clearInterval(intervalId);
    }, [lastDonationTime]);

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
