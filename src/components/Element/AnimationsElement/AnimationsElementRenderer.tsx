import { observer } from "mobx-react-lite";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { AnimationsElementSettings } from "./AnimationsElement";
import { StateMachineContext } from "../StateMachine/StateMachine";
import { sleep } from "../../../utils";

function calcAnimation(value: AnimationPropertyValue): string {
  if (value.animation === "none") {
    return "";
  }
  return `animate__animated animate__${value.animation}`;
}

function calcAnimationDuration(value: AnimationPropertyValue): CSSProperties {
  if (!value.duration) {
    return {};
  }
  return {
    "--animate-duration": `${value.duration / 1000}s`,
  } as CSSProperties;
}

export const AnimationsElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: React.ReactNode;
    settings: AnimationsElementSettings;
  }) => {
    const [style, setStyle] = useState<CSSProperties>({});
    const [className, setClassName] = useState<string>("");
    const stateMachine = useContext(StateMachineContext);

    useEffect(() => {
      stateMachine.addCallback("visible", () => {
        if (settings.inAnimation.animation !== "none") {
          setStyle(calcAnimationDuration(settings.inAnimation));
          setClassName(calcAnimation(settings.inAnimation));
          return sleep(settings.inAnimation.duration);
        } else {
          setStyle({});
          return Promise.resolve();
        }
      });
      stateMachine.addCallback("hidden", () => {
        if (settings.outAnimation.animation !== "none") {
          setStyle(calcAnimationDuration(settings.outAnimation));
          setClassName(calcAnimation(settings.outAnimation));
          return new Promise((resolve) => {
            setTimeout(() => {
              setClassName("");
              setStyle({ display: "none" });
              resolve();
            }, settings.outAnimation.duration);
          });
        } else {
          setClassName("");
          setStyle({ display: "none" });
          return Promise.resolve();
        }
      });
    }, [stateMachine]);

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  },
);
