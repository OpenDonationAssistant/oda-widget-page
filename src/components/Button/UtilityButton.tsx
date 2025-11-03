import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./UtilityButton.module.css";

export default function UtilityButton({
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
