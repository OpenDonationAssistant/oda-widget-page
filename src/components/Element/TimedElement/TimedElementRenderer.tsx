import { observer } from "mobx-react-lite";
import { TimedElementSettings } from "./TimedElement";
import { CSSProperties, useEffect, useState } from "react";
import { AnimationPropertyValue } from "../../ConfigurationPage/widgetproperties/AnimationProperty";

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

export const TimedElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: React.ReactNode;
    settings: TimedElementSettings;
  }) => {
    const [show, setShow] = useState<boolean>(false);
    const [style, setStyle] = useState<CSSProperties>({});
    const [className, setClassName] = useState<string>("");

    useEffect(() => {
      let beforeHideTime = settings.shownDuration + settings.shownDuration;
      if (settings.inAnimation.animation !== "none") {
        beforeHideTime += settings.inAnimation.duration;
      }
      let allDuration = beforeHideTime;
      if (settings.outAnimation.animation !== "none") {
        allDuration += settings.outAnimation.duration;
      }

      const intervalId = setInterval(() => {
        setTimeout(() => {
          if (settings.inAnimation.animation !== "none") {
            setClassName(calcAnimation(settings.inAnimation));
            setStyle(calcAnimationDuration(settings.inAnimation));
            setTimeout(() => {
              setClassName("");
              setStyle({});
            }, settings.inAnimation.duration);
          }
          setShow(true);
        }, settings.hiddenDuration);

        setTimeout(() => {
          if (settings.outAnimation.animation !== "none") {
            setClassName(calcAnimation(settings.outAnimation));
            setStyle(calcAnimationDuration(settings.outAnimation));
            setTimeout(() => {
              setClassName("");
              setStyle({});
              setShow(false);
            }, settings.outAnimation.duration);
          } else {
            setClassName("");
            setStyle({});
            setShow(false);
          }
        }, beforeHideTime);

      }, allDuration);

      return () => {
        clearInterval(intervalId);
      };
    }, [settings.shownDuration, settings.hiddenDuration]);

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
