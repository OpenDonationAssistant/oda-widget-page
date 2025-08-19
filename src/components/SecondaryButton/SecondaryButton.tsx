import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./SecondaryButton.module.css";

export default function SecondaryButton({
  children,
  onClick,
  className,
  disabled
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean
}) {
  return (
    <>
      <button
        className={`${classes.button} ${className ?? ""}`}
        disabled={disabled}
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
