import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./SecondaryButton.module.css";

export default function SecondaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <>
      <button
        className={`${classes.button} ${className ?? ""}`}
        onClick={() => {
          onClick();
        }}
      >
        <Flex align="center" gap={3}>
          {children}
        </Flex>
      </button>
    </>
  );
}
