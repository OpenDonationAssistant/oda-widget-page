import { observer } from "mobx-react-lite";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import { AnimationsElementSettings } from "./AnimationsElement";
import { StateMachineContext } from "../StateMachine";

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
    elementId,
  }: {
    children: React.ReactNode;
    settings: AnimationsElementSettings;
    elementId: string;
  }) => {
    const [show, setShow] = useState<boolean>(false);
    const [style, setStyle] = useState<CSSProperties>({});
    const [className, setClassName] = useState<string>("");
    const stateMachine = useContext(StateMachineContext);

    useEffect(() => {
      if (
        stateMachine.state === "start" &&
        settings.inAnimation.animation !== "none"
      ) {
        setShow(true);
        const timeoutId = setTimeout(() => {
          stateMachine.setComponentState(elementId, true);
        }, settings.inAnimation.duration);
        setStyle(calcAnimationDuration(settings.inAnimation));
        setClassName(calcAnimation(settings.inAnimation));
        return () => clearTimeout(timeoutId);
      }
      if (
        stateMachine.state === "end" &&
        settings.outAnimation.animation !== "none"
      ) {
        const timeoutId = setTimeout(() => {
          setShow(false);
          stateMachine.setComponentState(elementId, true);
        }, settings.outAnimation.duration);

        setStyle(calcAnimationDuration(settings.outAnimation));
        setClassName(calcAnimation(settings.outAnimation));
        return () => clearTimeout(timeoutId);
      }
      stateMachine.setComponentState(elementId, true);
    }, [stateMachine.state]);

    if (!show) {
      return <></>;
    }

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  },
);
