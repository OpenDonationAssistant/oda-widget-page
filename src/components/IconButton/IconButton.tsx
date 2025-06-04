import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./IconButton.module.css";

export function NotBorderedIconButton({
  children,
  onClick
}:{
  children: ReactNode;
  onClick: () => void;
}){
  return (
    <>
      <button
        className={`${classes.button} ${classes.notbordered}`}
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

export function BorderedIconButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <>
      <button
        className={`${classes.button} ${classes.bordered}`}
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
