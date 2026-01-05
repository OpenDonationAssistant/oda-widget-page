import { observer } from "mobx-react-lite";
import { ProgressElementSvgSettings } from "./ProgressElementSvgSettings";
import ProgressBar from "progressbar.js";
import { useContext, useEffect, useRef, useState } from "react";
import { VariableStoreContext } from "../../../stores/VariableStore";
import { log } from "../../../logging";

export const ProgressElementSvgRenderer = observer(
  ({ settings }: { settings: ProgressElementSvgSettings }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const variables = useContext(VariableStoreContext);
    const required = variables.getValue("required", 0) as number;
    const collected = variables.getValue("collected", 0) as number;
    const [progressBar, setProgressBar] = useState<any>(null);

    useEffect(() => {
      if (!ref.current) return;
      if (progressBar) {
        progressBar.destroy();
      }
      var bar = new ProgressBar.Line(ref.current, {
        strokeWidth: 10,
      });
      setProgressBar(bar);
      log.debug({ required, collected }, "animate");
      bar.animate(collected / required);
    }, [ref.current, required, collected]);

    return <div ref={ref} />;
  },
);
