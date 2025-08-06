import { MouseEventHandler, ReactNode } from "react";
import classes from "./CardsComponent.module.css";
import { Button, Flex } from "antd";

export function Card({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick: MouseEventHandler<HTMLElement>;
}) {
  return (
    <Flex
      className={`${classes.card} ${selected ? classes.selected : classes.notselected}`}
      onClick={onClick}
    >
      {children}
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

export function CardList({ children }: { children: ReactNode }) {
  return <div className={`${classes.cardlist}`}>{children}</div>;
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
