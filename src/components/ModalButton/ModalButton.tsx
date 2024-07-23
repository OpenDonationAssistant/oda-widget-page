import React, { ReactNode, useState } from "react";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { Modal } from "antd";
import { Trans, useTranslation } from "react-i18next";

export default function ModalButton({
  label,
  buttonLabel,
  modalTitle,
  children,
}: {
  label: string;
  buttonLabel: string;
  modalTitle: string;
  children: ReactNode;
}) {
  const [showModal, setShowModal] = useState<boolean>();
  const { t  } = useTranslation();

  function toggleModal() {
    const classList = document.getElementById("root")?.classList;
    if (classList?.contains("blured")) {
      classList.remove("blured");
    } else {
      classList?.add("blured");
    }
    setShowModal((old) => !old);
  }

  return (
    <LabeledContainer displayName={label}>
      <button className={`full-width oda-btn-default`} onClick={toggleModal}>
        <Trans i18nKey={buttonLabel} />
      </button>
      <Modal
        title={t(modalTitle)}
        open={showModal}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={toggleModal}
      >
        {children}
      </Modal>
    </LabeledContainer>
  );
}
