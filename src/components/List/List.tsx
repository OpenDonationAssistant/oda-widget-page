import { MouseEventHandler, ReactNode, useState } from "react";
import { log } from "../../logging";
import classes from "./List.module.css";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";

export const CollapsibleListItem = ({
  title,
  actions,
  children,
}: {
  title: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <Flex vertical className={`${classes.collapsible}`}>
      <ListItem
        first={title}
        second={
          <Flex align="center" gap={3}>
            {actions}
            {opened ? <ArrowUp /> : <ArrowDown />}
          </Flex>
        }
        onClick={() => setOpened(!opened)}
      />
      {opened && <div className={`${classes.listitemcontent}`}>{children}</div>}
    </Flex>
  );
};

export const ListItem = ({
  first,
  second,
  onClick,
}: {
  first: ReactNode;
  second: ReactNode;
  onClick?: () => void;
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
      className={`${classes.listitem}`}
    >
      {first}
      {second}
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
        <span className="material-symbols-sharp">add</span>
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
