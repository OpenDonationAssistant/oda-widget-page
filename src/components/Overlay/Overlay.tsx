import { Flex } from "antd";
import classes from "./Overlay.module.css";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { log } from "../../logging";
import { createPortal } from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

export class ModalState {
  private _show: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  public set show(show: boolean) {
    this._show = show;
  }
  public get show() {
    return this._show;
  }
}

export const ModalStateContext = createContext(new ModalState());

export const Panel = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      className={`${classes.modal} ${classes.big}`}
      justify="flex-start"
      vertical
    >
      {children}
    </Flex>
  );
};

export const Dialog = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      className={`${classes.modal} ${classes.small}`}
      justify="flex-start"
      vertical
    >
      {children}
    </Flex>
  );
};

export const Title = ({ children }: { children: ReactNode }) => {
  return <div className={`${classes.title}`}>{children}</div>;
};

export const Subtitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Flex className={className}>
      <div className={`${classes.subtitle}`}>{children}</div>
    </Flex>
  );
};

export const Overlay = observer(({ children }: { children: ReactNode }) => {
  const state = useContext(ModalStateContext);

  const backRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const buttons = document.getElementById("support-buttons");
    if (!buttons) {
      return;
    }
    const hidden = buttons.classList.contains("hidden");
    if (state.show && !hidden) {
      buttons.classList.add("hidden");
    }
    if (!state.show && hidden) {
      buttons.classList.remove("hidden");
    }
  }, [state.show]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!event.target) {
        return;
      }
      log.debug(
        {
          show: state.show,
          misses: backRef.current?.contains(event.target as Node),
          target: event.target,
        },
        "handling click outside",
      );
      if (backRef.current?.contains(event.target as Node) && state.show) {
        log.debug("closing modal");
        state.show = false;
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.show]);

  return (
    <>
      {state.show &&
        createPortal(
          <>
            <div ref={backRef} className={`${classes.back}`} />
            {children}
          </>,
          document.getElementById("root") ?? document.body,
        )}
    </>
  );
});
