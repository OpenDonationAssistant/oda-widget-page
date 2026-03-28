import { Modal } from "antd";
import { useContext } from "react";
import { ErrorStoreContext } from "../../stores/ErrorStore";
import { observer } from "mobx-react-lite";
import classes from "./ErrorPopup.module.css";

export const ErrorPopup = observer(() => {
  const errorStore = useContext(ErrorStoreContext);

  return (
    <Modal
      className={`${classes.errormodal}`}
      title="Ошибка"
      open={!!errorStore.error}
      onOk={() => errorStore.clearError()}
      onCancel={() => errorStore.clearError()}
      okText="ОК"
    >
      <p>{errorStore.error?.message}</p>
    </Modal>
  );
});
