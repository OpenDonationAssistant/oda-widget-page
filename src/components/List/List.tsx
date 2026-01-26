import { MouseEventHandler, ReactNode, useState } from "react";
import { log } from "../../logging";
import classes from "./List.module.css";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";
import AddIcon from "../../icons/AddIcon";

export const ListItem = ({
  first,
  second,
  onClick,
  className,
}: {
  first: ReactNode;
  second: ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const clickHandler: MouseEventHandler = (e) => {
    let target = e.target as HTMLElement;
    log.debug({ target: target, currentTarget: e.currentTarget });
    while (target.parentNode) {
      if (target.localName === "button") {
        log.debug("click on button");
        return;
      }
      if (target === e.currentTarget) {
        log.debug("click on element");
        onClick?.();
        return;
      }
      target = target.parentNode as HTMLElement;
    }
  };
  return (
    <Flex
      justify="space-between"
      align="center"
      onClick={clickHandler}
      className={`${classes.listitem} ${className}`}
    >
      {first}
      {second}
    </Flex>
  );
};

export const CollapsibleListItem = ({
  children,
  first,
  second,
}: {
  children: ReactNode;
  first: ReactNode;
  second: ReactNode;
}) => {
  const [opened, setOpened] = useState<boolean>(() => false);
  return (
    <Flex vertical className={`${classes.wrapper}`}>
      <ListItem
        onClick={() => setOpened(!opened)}
        first={first}
        second={
          <Flex align="center" justify="flex-end" gap={3}>
            {second}
            {opened ? <ArrowUp /> : <ArrowDown />}
          </Flex>
        }
        className={`${opened ? classes.opened : ""}`}
      />
      {opened && <div className={`${classes.content}`}>{children}</div>}
    </Flex>
  );
};

export const AddListItemButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <button className={`${classes.adddalertbutton}`} onClick={onClick}>
      <Flex justify="center" align="center" gap={3}>
        <AddIcon color="var(--oda-primary-color)" />
        <div>{t(label)}</div>
      </Flex>
    </button>
  );
};

export const List = ({ children }: { children: ReactNode }) => {
  return (
    <Flex gap={3} vertical>
      {children}
    </Flex>
  );
};
