import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useRef,
} from "react";
import classes from "./ElementClickTarget.module.css";

const TAP_MOVEMENT_THRESHOLD = 4;

interface TapPointerEvent extends PointerEvent {
  __odaElementSelected?: boolean;
}

export const ElementClickTarget = ({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) => {
  const start = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    start.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const from = start.current;
    start.current = null;
    if (!from || from.pointerId !== event.pointerId) {
      return;
    }
    if (
      Math.hypot(event.clientX - from.x, event.clientY - from.y) >
      TAP_MOVEMENT_THRESHOLD
    ) {
      return;
    }
    const native = event.nativeEvent as TapPointerEvent;
    if (native.__odaElementSelected) {
      return;
    }
    native.__odaElementSelected = true;
    onSelect();
  };

  return (
    <div
      className={`${classes.clickTarget} ${selected ? classes.selected : ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
};
