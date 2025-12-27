import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { MarqueeElementSettings } from "./MarqueeElement";
import Marquee from "react-fast-marquee";

export const MarqueeElementRenderer = observer(
  ({
    children,
    settings,
  }: {
    children: ReactNode;
    settings: MarqueeElementSettings;
  }) => {
    return (
      <Marquee autoFill={settings.autofill} direction={settings.direction}>
        {children}
      </Marquee>
    );
  },
);
