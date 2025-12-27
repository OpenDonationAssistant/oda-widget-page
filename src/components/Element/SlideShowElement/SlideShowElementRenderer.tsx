import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";
import { SlideShowElementSettings } from "./SlideShowElement";
import { Flex } from "antd";

export const SlideShowElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: ReactNode[];
    settings: SlideShowElementSettings;
  }) => {
    const [index, setIndex] = useState<number>(() => 0);
    const [containerClassName, setContainerClassName] = useState<string>("");

    useEffect(() => {
      const next = setTimeout(
        () => {
          setContainerClassName(
            `animate__animated animate__${settings.outAnimation.animation}`,
          );
          setTimeout(() => {
            setIndex((index + 1) % children.length);
            setContainerClassName(
              `animate__animated animate__${settings.inAnimation.animation}`,
            );
            setTimeout(
              () => setContainerClassName(""),
              settings.outAnimation.duration,
            );
          }, settings.inAnimation.duration);
        },
        settings.period + (settings.inAnimation?.duration ?? 1000),
      );
      return () => clearTimeout(next);
    }, [index, settings.inAnimation, settings.outAnimation, settings.period]);

    if (!children || children.length === 0) {
      return <></>;
    }

    return (
      <Flex className={`${containerClassName} full-width`}>
        {children[index]}
      </Flex>
    );
  },
);
