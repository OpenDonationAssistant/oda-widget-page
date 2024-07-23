import { Modal } from "antd";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TextPropertyModal({
  title,
  children,
  className
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  function toggleModal() {
    const classList = document.getElementById("root")?.classList;
    if (classList?.contains("blured")) {
      classList.remove("blured");
    } else {
      classList?.add("blured");
    }
    setIsModalOpen((old) => !old);
  }

  const handleOk = () => {
    document.getElementById("root")?.classList.remove("blured");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    document.getElementById("root")?.classList.remove("blured");
    setIsModalOpen(false);
  };

  return (
    <>
      <button className={`oda-btn-default`} onClick={toggleModal}>
        {t("button-edit")}
      </button>
      <Modal
        className={className}
        title={t(title)}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
}
