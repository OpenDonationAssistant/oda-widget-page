import { ReactNode, useState } from "react";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { Modal } from "antd";
import { Trans, useTranslation } from "react-i18next";
import SecondaryButton from "../Button/SecondaryButton";

export default function ModalButton({
  label,
  buttonLabel,
  modalTitle,
  help,
  className,
  children,
  icon,
}: {
  label: string;
  buttonLabel: string;
  modalTitle: string;
  help?: string;
  className?: string;
  children: ReactNode;
  icon?: string;
}) {
  const [showModal, setShowModal] = useState<boolean>();
  const { t } = useTranslation();

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
    <LabeledContainer help={help} displayName={label}>
      <SecondaryButton className="full-width" onClick={toggleModal}>
        {icon && <span className="material-symbols-sharp">{icon}</span>}
        <div>
          <Trans i18nKey={buttonLabel} />
        </div>
      </SecondaryButton>
      <Modal
        title={t(modalTitle)}
        open={showModal}
        className={className}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={toggleModal}
      >
        {children}
      </Modal>
    </LabeledContainer>
  );
}
