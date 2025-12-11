import { MouseEventHandler, ReactNode } from "react";
import classes from "./CardsComponent.module.css";
import { Button, Flex } from "antd";
import { log } from "../../logging";
import SelectedIcon from "../../icons/SelectedIcon";

export function Card({
  children,
  selected,
  onClick,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick: MouseEventHandler<Element>;
  className?: string;
}) {
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
        onClick?.(e);
        return;
      }
      target = target.parentNode as HTMLElement;
    }
  };

  return (
    <Flex
      className={`${classes.card} ${selected ? classes.selected : classes.notselected} ${className ? className : ""}`}
      onClick={clickHandler}
      vertical
      justify="space-between"
    >
      {children}
      {selected && (
        <div className={`${classes.checkicon}`}>
          <SelectedIcon />
        </div>
      )}
    </Flex>
  );
}

export function CardTitle({
  children,
  cssClass,
}: {
  children: ReactNode;
  cssClass?: string;
}) {
  return (
    <Flex className={`${classes.cardtitle} ${cssClass ?? ""}`}>{children}</Flex>
  );
}

export function CardSection({ children }: { children: ReactNode }) {
  return (
    <Flex vertical gap={9}>
      {children}
    </Flex>
  );
}

export function CardSectionTitle({ children }: { children: ReactNode }) {
  return <div className={`${classes.sectionname}`}>{children}</div>;
}

export function CardList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${classes.cardlist} ${className}`}>{children}</div>;
}

export function CardButton({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick: MouseEventHandler<HTMLElement>;
}) {
  return (
    <Button className={`${classes.buttoncard}`} onClick={onClick}>
      <Flex
        vertical
        justify="center"
        align="center"
        gap={3}
        className="full-height"
      >
        {children && children}
        {!children && (
          <>
            <span className="material-symbols-sharp">add</span>
            <div>Добавить</div>
          </>
        )}
      </Flex>
    </Button>
  );
}
