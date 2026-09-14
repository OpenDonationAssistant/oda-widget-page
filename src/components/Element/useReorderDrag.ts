import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type ReorderDirection = "row" | "column" | "stack";

interface DragState {
  draggedId: string;
  container: HTMLElement;
}

function firstMeasurable(node: HTMLElement): HTMLElement | null {
  const rect = node.getBoundingClientRect();
  if (rect.width > 0 || rect.height > 0) {
    return node;
  }
  for (const child of Array.from(node.children)) {
    if (child instanceof HTMLElement) {
      const measurable = firstMeasurable(child);
      if (measurable) {
        return measurable;
      }
    }
  }
  return null;
}

function calculateIndicator(
  direction: ReorderDirection,
  container: HTMLElement,
  node: HTMLElement,
): CSSProperties {
  const containerRect = container.getBoundingClientRect();
  const anchor = firstMeasurable(node) ?? node;
  const rect = anchor.getBoundingClientRect();
  const offsetLeft = rect.left - containerRect.left - container.clientLeft;
  const offsetTop = rect.top - containerRect.top - container.clientTop;
  if (direction === "row") {
    return {
      position: "absolute",
      top: 0,
      left: offsetLeft,
      width: 2,
      height: containerRect.height,
    };
  }
  return {
    position: "absolute",
    left: 0,
    top: offsetTop,
    height: 2,
    width: containerRect.width,
  };
}

export function useReorderDrag({
  direction,
  onReorder,
}: {
  direction: ReorderDirection;
  onReorder: (draggedId: string, targetId: string) => void;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties | null>(
    null,
  );
  const dragRef = useRef<DragState | null>(null);
  const targetRef = useRef<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, id: string) => {
      if (event.button !== 0) {
        return;
      }
      const container = event.currentTarget.parentElement;
      if (!container) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      cleanupRef.current?.();

      dragRef.current = { draggedId: id, container };
      targetRef.current = null;
      setDraggedId(id);
      document.body.style.cursor = "grabbing";

      function handleMove(moveEvent: PointerEvent) {
        const drag = dragRef.current;
        if (!drag) {
          return;
        }
        const node = document
          .elementFromPoint(moveEvent.clientX, moveEvent.clientY)
          ?.closest<HTMLElement>("[data-element-id]");
        if (!node || node.parentElement !== drag.container) {
          return;
        }
        const targetId = node.dataset.elementId ?? null;
        if (!targetId || targetId === drag.draggedId) {
          return;
        }
        targetRef.current = targetId;
        setIndicatorStyle(calculateIndicator(direction, drag.container, node));
      }

      function teardown() {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        document.body.style.cursor = "";
      }

      function finish() {
        teardown();
        cleanupRef.current = null;
        const drag = dragRef.current;
        const targetId = targetRef.current;
        dragRef.current = null;
        targetRef.current = null;
        setDraggedId(null);
        setIndicatorStyle(null);
        if (drag && targetId && targetId !== drag.draggedId) {
          onReorder(drag.draggedId, targetId);
        }
      }

      function handleUp() {
        finish();
      }

      cleanupRef.current = teardown;
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [direction, onReorder],
  );

  return { draggedId, indicatorStyle, handlePointerDown };
}
