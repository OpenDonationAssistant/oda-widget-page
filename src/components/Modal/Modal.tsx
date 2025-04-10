import { Button, Flex } from "antd";
import classes from "./Modal.module.css";
import { ReactNode } from "react";

export default function Modal({
  children,
  title,
  show,
  showSubmitButton,
  size = "normal",
  onSubmit,
  onDecline,
}: {
  children: ReactNode;
  title?: string;
  show: boolean;
  showSubmitButton?: boolean;
  size: "normal" | "big";
  onSubmit: () => void;
  onDecline: () => void;
}) {
  return (
    <>
      {show && (
        <Flex
          className={`${classes.modal} ${size === "normal" ? classes.normalmodal : classes.bigmodal}`}
          justify="flex-start"
          vertical
        >
          <div className={`${classes.back}`} />
          <Flex
            vertical
            justify="space-between"
            className={`${classes.content}`}
          >
            {title && <Flex className={`${classes.title}`}>{title}</Flex>}
            <Flex>{children}</Flex>
            <Flex
              className={`${classes.buttons} full-width`}
              justify="flex-end"
              gap={9}
            >
              <Button onClick={onDecline} className={`${classes.decline}`}>
                Отменить
              </Button>
              {(showSubmitButton === undefined || showSubmitButton) && (
                <Button className={`${classes.save}`} onClick={onSubmit}>
                  Сохранить
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}
