import { Flex } from "antd";
import classes from "./Panel.module.css";
import { ReactNode } from "react";

export default function Panel({ children }: { children: ReactNode }) {
  return (
    <Flex className={`${classes.panel}`} vertical gap={12}>
      {children}
    </Flex>
  );
}
