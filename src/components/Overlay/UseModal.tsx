import { useContext, useState } from "react";
import { ModalState, ModalStateContext } from "./Overlay";

export function useModal() {
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  return { modalState };
}
