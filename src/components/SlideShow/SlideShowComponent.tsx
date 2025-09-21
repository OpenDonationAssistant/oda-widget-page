import { Flex } from "antd";
import { ReactNode, useEffect, useState } from "react";

export interface Animation {
  type?: string;
  duration?: number;
}

export function SlideShowComponent({
  slides,
  period,
  inAnimation,
  outAnimation,
}: {
  slides: ReactNode[];
  period: number;
  inAnimation?: Animation;
  outAnimation?: Animation;
}) {

  const [index, setIndex] = useState<number>(() => 0);
  const [containerClassName, setContainerClassName] = useState<string>("");

  useEffect(() => {
    const next = setTimeout(
      () => {
        setContainerClassName(`animate__animated animate__${outAnimation?.type ?? ""}`);
        setTimeout(() => {
          setIndex((index + 1) % slides.length);
          setContainerClassName(`animate__animated animate__${inAnimation?.type ?? "flipInY"}`);
          setTimeout(
            () => setContainerClassName(""),
            outAnimation?.duration ?? 1000,
          );
        }, inAnimation?.duration ?? 1000);
      },
      period + (inAnimation?.duration ?? 1000),
    );
    return () => clearTimeout(next);
  }, [index, inAnimation, outAnimation, period]);

  if (!slides || slides.length === 0) {
    return <></>;
  }

  return <Flex className={`${containerClassName} full-width`}>{slides[index]}</Flex>;
}
