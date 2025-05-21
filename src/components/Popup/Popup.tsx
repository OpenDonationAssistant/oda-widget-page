import { Flex } from "antd";
import classes from "./ModalPanel.module.css";
import { ReactNode, useEffect, useRef } from "react";
import { log } from "../../logging";
import { createPortal } from "react-dom";

export default function Popup({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) {
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
      if (!event.target) {
        return;
      }
      log.debug(
        {
          show: show,
          misses: backRef.current?.contains(event.target as Node),
          target: event.target,
        },
        "handling click outside",
      );
      if (backRef.current?.contains(event.target as Node) && show) {
        log.debug("closing modal");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

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
              {children}
            </Flex>
          </>,
          document.getElementById("root") ?? document.body,
        )}
    </>
  );
}
