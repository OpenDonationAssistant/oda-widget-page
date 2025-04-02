import { Flex } from "antd";
import { ReactNode } from "react";
import classes from "./Panel.module.css";

export default function Panel({ children }: { children: ReactNode }) {
  return <Flex className={`${classes.panel}`}>{children}</Flex>;
}
