import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./IconButton.module.css";

export function NotBorderedIconButton({
  children,
  onClick,
  className
}:{
  children: ReactNode;
  onClick: () => void;
  className?: string;
}){
  return (
    <>
      <button
        className={`${classes.button} ${classes.notbordered} ${className ? className : ""}`}
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
  className
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <>
      <button
        className={`${classes.button} ${classes.bordered} ${className ? className : ""}`}
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
