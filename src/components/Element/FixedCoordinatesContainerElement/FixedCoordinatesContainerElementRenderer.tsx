import { observer } from "mobx-react-lite";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import {
  calcAnimation,
  calcAnimationDuration,
  calcBackgroundColor,
  calcBorder,
  calcHeight,
  calcPadding,
  calcRotation,
  calcRounding,
  calcShadows,
  calcWidth,
  resolveUri,
} from "../elementVisualStyles";
import {
  ElementPosition,
  FixedCoordinatesContainerElementSettings,
} from "./FixedCoordinatesContainerElement";
import classes from "./FixedCoordinatesContainerElementRenderer.module.css";

export const FixedCoordinatesChild = ({
  position,
  children,
}: {
  position?: ElementPosition;
  children: ReactNode;
}) => {
  return (
    <div
      className={classes.child}
      style={{
        position: "absolute",
        left: `${position?.x ?? 0}px`,
        top: `${position?.y ?? 0}px`,
      }}
    >
      {children}
    </div>
  );
};

export const FixedCoordinatesContainerElementRenderer = observer(
  ({
    children,
    settings,
    style,
  }: {
    children: ReactNode | ReactNode[];
    settings: FixedCoordinatesContainerElementSettings;
    style?: CSSProperties;
  }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [imageStyle, setImageStyle] = useState<CSSProperties>({});

    useEffect(() => {
      setLoading(true);
      resolveUri(settings.backgroundImage).then((image) => {
        setImageStyle(image);
        setLoading(false);
      });
    }, [
      settings.backgroundImage.url,
      settings.backgroundImage.name,
      settings.backgroundImage.size,
      settings.backgroundImage.repeat,
      settings.backgroundImage.opacity,
    ]);

    return (
      <>
        {loading && <></>}
        {!loading && (
          <div
            style={{
              ...calcBorder(settings.border),
              ...calcPadding(settings.padding),
              ...calcRounding(settings.rounding),
              ...calcShadows(settings.shadow),
              ...calcBackgroundColor(settings.backgroundColor),
              ...calcWidth(settings.width),
              ...calcHeight(settings.height),
              ...calcAnimationDuration(settings.animation),
              ...calcRotation(settings.rotation),
              ...imageStyle,
              ...{ overflow: "hidden" },
              ...(style ?? {}),
            }}
            className={`${calcAnimation(settings.animation)} ${
              classes.container
            }`}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);
