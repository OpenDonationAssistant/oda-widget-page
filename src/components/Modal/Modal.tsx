import { Button, Flex } from "antd";
import classes from "./Modal.module.css";
import { ReactNode, useEffect, useRef } from "react";
import { log } from "../../logging";

export default function Modal({
  children,
  title,
  subtitle,
  show,
  showSubmitButton,
  showDeclineButton,
  submitButtonText,
  declineButtonText,
  note,
  size = "normal",
  onSubmit,
  onDecline,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  show: boolean;
  showSubmitButton?: boolean;
  showDeclineButton?: boolean;
  submitButtonText?: string;
  declineButtonText?: string;
  size: "normal" | "big";
  note?: ReactNode;
  onSubmit: () => void;
  onDecline: () => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      log.info(
        {
          modalRef: modalRef.current,
          show: show,
          contains: modalRef.current?.contains(event.target),
        },
        "handling click outside",
      );
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        show
      ) {
        log.info("closing modal");
        onDecline();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, show]);

  return (
    <>
      {show && (
        <>
          <div className={`${classes.back}`} />
          <Flex
            className={`${classes.modal} ${size === "normal" ? classes.normalmodal : classes.bigmodal}`}
            justify="flex-start"
            vertical
          >
            <Flex
              ref={modalRef}
              vertical
              justify="space-between"
              className={`${classes.content}`}
              gap={60}
            >
              {(title || subtitle) && (
                <Flex vertical>
                  {title && <div className={`${classes.title}`}>{title}</div>}
                  {subtitle && (
                    <div className={`${classes.subtitle}`}>{subtitle}</div>
                  )}
                </Flex>
              )}
              <Flex>{children}</Flex>
              <Flex
                className={`${classes.buttons} full-width`}
                align="flex-end"
                justify="space-between"
              >
                <Flex className={`${classes.note}`}>{note}</Flex>
                <Flex justify="flex-end" gap={9}>
                  {(showDeclineButton === undefined || showDeclineButton) && (
                    <Button
                      onClick={onDecline}
                      className={`${classes.decline}`}
                    >
                      {declineButtonText ? declineButtonText : "Отменить"}
                    </Button>
                  )}
                  {(showSubmitButton === undefined || showSubmitButton) && (
                    <Button className={`${classes.save}`} onClick={onSubmit}>
                      {submitButtonText ? submitButtonText : "Сохранить"}
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}
