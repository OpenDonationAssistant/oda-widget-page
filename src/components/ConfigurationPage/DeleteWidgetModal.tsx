import { Widget } from "../../types/Widget";
import Confirmation from "../Confirmation/Confirmation";
import { BorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

export default function DeleteWidgetModal({ widget }: { widget: Widget }) {
  return (
    <Confirmation
      message="Вы действительно хотите удалить виджет?"
      onConfirm={() => widget.delete()}
      trigger={(open) => (
        <BorderedIconButton onClick={open}>
          <CloseIcon color="#FF8888" />
        </BorderedIconButton>
      )}
    />
  );
}
