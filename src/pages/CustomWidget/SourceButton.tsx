import { Flex } from "antd";
import classes from "./SourceButton.module.css";
import { ChangeEvent, ReactNode, useState } from "react";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";

export default function SourceButton({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <Flex vertical className={`${classes.container}`}>
      <button
        className={`${classes.collapselikebutton}`}
        onClick={() => setOpened((old) => !old)}
      >
        <Flex justify="space-between" align="center" gap={3}>
          {label}
          {opened ? <ArrowUp /> : <ArrowDown />}
        </Flex>
      </button>
      {opened && children}
    </Flex>
  );
}
