import { useContext, useState } from "react";
import { Widget } from "../../types/Widget";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../Overlay/Overlay";
import { BorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

export default function DeleteWidgetModal({ widget }: { widget: Widget }) {
  const parentModalState = useContext(ModalStateContext);
  const [dialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  return (
    <>
      <ModalStateContext.Provider value={dialogState}>
        <Overlay>
          <Warning action={() => widget.delete()}>
            Вы действительно хотите удалить виджет?
          </Warning>
        </Overlay>
        <BorderedIconButton onClick={() => (dialogState.show = true)}>
          <CloseIcon color="#FF8888" />
        </BorderedIconButton>
      </ModalStateContext.Provider>
    </>
  );
}
