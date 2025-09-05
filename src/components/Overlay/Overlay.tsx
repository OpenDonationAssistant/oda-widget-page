import { Flex } from "antd";
import classes from "./Overlay.module.css";
import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { log } from "../../logging";
import { createPortal } from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { useKeyPress } from "ahooks";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

export class ModalState {
  private _show: boolean = false;
  private _level: number;
  private _onTop: boolean = false;
  private _parent: ModalState | null;
  private _onClose: () => void = () => {};

  constructor(parent?: ModalState, onClose?: () => void, show?: boolean) {
    this._onTop = false;
    this._level = (parent?.level ?? -2) + 1;
    this._parent = parent ?? null;
    if (onClose) {
      this._onClose = onClose;
    }
    if (show) {
      this._show = show;
    }
    makeAutoObservable(this);
  }
  public handleEscape() {
    if (this.show && this._onTop) {
      console.log({ state: this }, "handle keypress");
      this._show = false;
      this._onTop = false;
      if (this._parent !== null) {
        this._parent.onTop = true;
      }
    }
  }
  public set onTop(onTop: boolean) {
    this._onTop = onTop;
  }
  public get onTop() {
    return this._onTop;
  }
  public setOnClose(fn: () => void) {
    this._onClose = fn;
  }
  public set show(show: boolean) {
    this._onTop = show;
    if (this._parent !== null) {
      this._parent.onTop = !show;
    }
    this._show = show;
  }
  public get show() {
    return this._show;
  }
  public set level(level: number) {
    this._level = level;
  }
  public get level() {
    return this._level;
  }
  public onClose() {
    log.debug("calling on close");
    this._onClose();
  }
}

export const ModalStateContext = createContext(new ModalState());

export const FullscreenPanel = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      className={`${classes.modal} ${classes.fullscreen}`}
      justify="flex-start"
      vertical
    >
      {children}
    </Flex>
  );
};

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
    <Flex vertical justify="center" align="center">
      <Flex
        className={`${classes.modal} ${classes.small}`}
        justify="flex-start"
        vertical
      >
        {children}
      </Flex>
    </Flex>
  );
};

export const Title = ({
  children,
  showClose = true,
}: {
  children: ReactNode;
  showClose?: boolean;
}) => {
  return (
    <Flex justify="space-between" className={`${classes.title}`}>
      {children}
      {showClose && <CloseOverlayButton />}
    </Flex>
  );
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

export const Warning = ({
  children,
  action,
}: {
  children: ReactNode;
  action: () => void;
}) => {
  const state = useContext(ModalStateContext);

  return (
    <Flex vertical className={`${classes.warning} ${classes.modal}`} gap={36}>
      <Title>Подтвердите действие</Title>
      <div className={`${classes.warningchildren}`}>{children}</div>
      <Flex className="full-width" justify="flex-end" gap={9}>
        <SecondaryButton
          onClick={() => {
            state.show = false;
          }}
        >
          Отменить
        </SecondaryButton>
        <PrimaryButton onClick={action}>Продолжить</PrimaryButton>
      </Flex>
    </Flex>
  );
};

export const CloseOverlayButton = ({}) => {
  const dialogState = useContext(ModalStateContext);

  return (
    <NotBorderedIconButton
      onClick={() => {
        dialogState.show = false;
      }}
    >
      <CloseIcon color="var(--oda-color-950)" />
    </NotBorderedIconButton>
  );
};

export const Overlay = observer(({ children }: { children: ReactNode }) => {
  const state = useContext(ModalStateContext);

  const backRef = useRef<HTMLDivElement | null>(null);

  useKeyPress(["ESC"], () => {
    state.handleEscape();
  });

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
      if (event.target === backRef.current && state.show) {
        state.onClose();
        state.show = false;
        event.stopPropagation();
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
            <div
              className={`${classes.back}`}
              style={{ zIndex: state.level * 200 }}
            />
            <div
              ref={backRef}
              className={`${classes.container}`}
              style={{ zIndex: state.level * 200 }}
            >
              {children}
            </div>
          </>,
          document.getElementById("root") ?? document.body,
        )}
    </>
  );
});
