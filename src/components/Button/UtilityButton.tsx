import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./UtilityButton.module.css";

export default function UtilityButton({
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
        className={`${classes.button} ${classes.className}`}
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
