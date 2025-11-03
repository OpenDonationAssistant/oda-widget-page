import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./SubActionButton.module.css";

export default function SubActionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
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
          {children}
        </Flex>
      </button>
    </>
  );
}
