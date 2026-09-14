import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { Element } from "./Element";
import { ReorderDirection, useReorderDrag } from "./useReorderDrag";
import classes from "./SortableChildren.module.css";

export const SortableChildren = observer(
  ({
    element,
    renderChild,
  }: {
    element: Element<any>;
    renderChild: (child: Element<any>) => ReactNode;
  }) => {
    const direction =
      (element.data.settings.direction as ReorderDirection) ?? "row";
    const children = element.children;
    const { draggedId, indicatorStyle, handlePointerDown } = useReorderDrag({
      direction,
      onReorder: (draggedElementId, targetId) => {
        children
          .find((child) => child.data.id === draggedElementId)
          ?.moveElement(targetId);
      },
    });

    const wrapperClass =
      direction === "stack" ? classes.stackChild : classes.flatChild;

    return (
      <>
        {children.map((child) => (
          <div
            key={child.data.id}
            data-element-id={child.data.id}
            className={`${wrapperClass} ${
              child.data.id === draggedId ? classes.dragging : ""
            }`}
            onPointerDown={(event) =>
              handlePointerDown(event, child.data.id)
            }
          >
            {renderChild(child)}
          </div>
        ))}
        {indicatorStyle && (
          <span className={classes.indicator} style={indicatorStyle} />
        )}
      </>
    );
  },
);
