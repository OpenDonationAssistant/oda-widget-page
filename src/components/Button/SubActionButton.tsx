import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./SubActionButton.module.css";

export default function SubActionButton({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: ReactNode;
}) {
  const labelClasses = [];
  if (icon) {
    labelClasses.push(classes.child);
  }
  return (
    <>
      <button
        className={`${classes.button}`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        <Flex align="center" gap={3} className="full-height full-width">
          {icon && <div className={`${classes.icon}`}>{icon}</div>}
          <div className={`${labelClasses}`}>{children}</div>
        </Flex>
      </button>
    </>
  );
}
