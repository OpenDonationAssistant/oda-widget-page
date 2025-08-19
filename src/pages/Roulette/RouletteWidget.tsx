import { useEffect, useRef, useState } from "react";
import { RouletteWidgetSettings } from "./RouletteWidgetSettings";
import { Wheel } from "spin-wheel";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { ReelStore } from "../../stores/ReelStore";
import { observer } from "mobx-react-lite";
import { log } from "../../logging";

const props = {
  radius: 1,
  items: [
    {
      label: "Час супер седюсера",
    },
    {
      label: "Кусок из детского видео",
    },
    {
      label: "Какой-то вопрос",
    },
  ],
};

export const RouletteWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: RouletteWidgetSettings;
    store: ReelStore;
  }) => {
    const spinRef = useRef<HTMLDivElement | null>(null);
    const [wheel, setWheel] = useState<any | null>(null);

    useEffect(() => {
      const wheel = new Wheel(spinRef.current, props);
      setWheel(wheel);
      if (store.options && store.selection) {
        const index = store.options.findIndex(
          (option) => option === store.selection,
        );
        wheel.spinToItem(index, 20000);
      }
      return () => wheel.remove();
    }, [spinRef.current, store.options]);

    useEffect(() => {
      log.debug(
        { selection: store.selection, options: store.options },
        "selection changed",
      );
      if (!store.selection && wheel) {
        wheel.stop();
        return;
      }
      if (!store.options) {
        return;
      }
      if (!wheel) {
        return;
      }
      const index = store.options.findIndex(
        (option) => option === store.selection,
      );
      wheel.spinToItem(index, 20000);
    }, [store.selection]);

    return (
      <>
        <div ref={spinRef} style={{ width: "100%", height: "100%" }} />
      </>
    );
  },
);
