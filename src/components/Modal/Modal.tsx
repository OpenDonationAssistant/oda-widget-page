import { Button, Flex } from "antd";
import classes from "./Modal.module.css";
import { ReactNode, useEffect, useRef } from "react";
import { log } from "../../logging";
import { createPortal } from "react-dom";

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
  const backRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const buttons = document.getElementById("support-buttons");
    if (!buttons) {
      return;
    }
    const hidden = buttons.classList.contains("hidden");
    if (show && !hidden) {
      buttons.classList.add("hidden");
    }
    if (!show && hidden) {
      buttons.classList.remove("hidden");
    }
  }, [show]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!event.target){
        return;
      }
      log.debug(
        {
          show: show,
          misses: backRef.current?.contains(event.target),
          target: event.target,
        },
        "handling click outside",
      );
      if (backRef.current?.contains(event.target) && show) {
        log.debug("closing modal");
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
      {show &&
        createPortal(
          <>
            <div ref={backRef} className={`${classes.back}`} />
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
                gap={36}
              >
                {(title || subtitle) && (
                  <Flex vertical>
                    {title && <div className={`${classes.title}`}>{title}</div>}
                    {subtitle && (
                      <div className={`${classes.subtitle}`}>{subtitle}</div>
                    )}
                  </Flex>
                )}
                <Flex className={`${classes.data}`}>{children}</Flex>
                <Flex
                  className={`${classes.buttons} full-width`}
                  align="flex-end"
                  justify="space-between"
                >
                  <Flex className={`${classes.note}`}>{note ?? " "}</Flex>
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
          </>,
          document.getElementById("root") ?? document.body,
        )}
    </>
  );
}
