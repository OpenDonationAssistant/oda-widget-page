import { observer } from "mobx-react-lite";
import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
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

const TAP_MOVEMENT_THRESHOLD = 4;

export function calculateDraggedPosition({
  start,
  pointerStart,
  pointer,
  scale,
}: {
  start: ElementPosition;
  pointerStart: { x: number; y: number };
  pointer: { x: number; y: number };
  scale: number;
}): ElementPosition {
  const safeScale = scale === 0 ? 1 : scale;
  return {
    x: Math.round(start.x + (pointer.x - pointerStart.x) / safeScale),
    y: Math.round(start.y + (pointer.y - pointerStart.y) / safeScale),
  };
}

export const FixedCoordinatesChild = ({
  position,
  editable = false,
  selectable = false,
  onSelect,
  onMove,
  children,
}: {
  position?: ElementPosition;
  editable?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
  onMove?: (position: ElementPosition) => void;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{
    position: ElementPosition;
    pointer: { x: number; y: number };
    scale: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const containerScale = (): number => {
    const container = ref.current?.parentElement;
    if (!container || container.offsetWidth === 0) {
      return 1;
    }
    return container.getBoundingClientRect().width / container.offsetWidth;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!editable || !onMove) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    ref.current?.setPointerCapture(event.pointerId);
    dragStart.current = {
      position: position ?? { x: 0, y: 0 },
      pointer: { x: event.clientX, y: event.clientY },
      scale: containerScale(),
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || !onMove) {
      return;
    }
    onMove(
      calculateDraggedPosition({
        start: start.position,
        pointerStart: start.pointer,
        pointer: { x: event.clientX, y: event.clientY },
        scale: start.scale,
      }),
    );
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) {
      return;
    }
    dragStart.current = null;
    setDragging(false);
    if (ref.current?.hasPointerCapture(event.pointerId)) {
      ref.current.releasePointerCapture(event.pointerId);
    }
    const moved =
      Math.hypot(
        event.clientX - start.pointer.x,
        event.clientY - start.pointer.y,
      ) > TAP_MOVEMENT_THRESHOLD;
    if (!moved && selectable) {
      const native = event.nativeEvent as PointerEvent & {
        __odaElementSelected?: boolean;
      };
      native.__odaElementSelected = true;
      onSelect?.();
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      className={`${classes.child} ${editable ? classes.editable : ""} ${
        dragging ? classes.dragging : ""
      }`}
      style={{
        zIndex: position?.zIndex,
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
