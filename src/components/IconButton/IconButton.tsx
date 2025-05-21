import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./IconButton.module.css";

export default function IconButton({
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
