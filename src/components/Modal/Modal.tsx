import { Button, Flex } from "antd";
import classes from "./Modal.module.css";
import { ReactNode } from "react";

export default function Modal({
  children,
  title,
  show,
  onSubmit,
  onDecline,
}: {
  children: ReactNode;
  title?: string;
  show: boolean;
  onSubmit: () => void;
  onDecline: () => void;
}) {
  return (
    <>
      {show && (
        <Flex className={`${classes.modal}`} justify="flex-start" vertical>
        <div className={`${classes.back}`}/>
          <Flex
            vertical
            justify="space-between"
            className={`${classes.content}`}
          >
            {title && <Flex className={`${classes.title}`}>{title}</Flex>}
            <Flex>{children}</Flex>
            <Flex className={`${classes.buttons}`} justify="flex-end" gap={9}>
              <Button onClick={onDecline} className={`${classes.decline}`}>
                Отменить
              </Button>
              <Button className={`${classes.save}`} onClick={onSubmit}>
                Сохранить
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}
