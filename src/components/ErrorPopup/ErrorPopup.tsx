import { Modal } from "antd";
import { useContext } from "react";
import { ErrorStoreContext } from "../../stores/ErrorStore";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import classes from "./ErrorPopup.module.css";

export const ErrorPopup = observer(() => {
  const { t } = useTranslation();
  const errorStore = useContext(ErrorStoreContext);

  return (
    <Modal
      className={`${classes.errormodal}`}
      title={t("common-error")}
      open={!!errorStore.error}
      onOk={() => errorStore.clearError()}
      onCancel={() => errorStore.clearError()}
      okText={t("dialog-ok")}
    >
      <p className={`${classes.errormessage}`}>{errorStore.error?.message}</p>
    </Modal>
  );
});
