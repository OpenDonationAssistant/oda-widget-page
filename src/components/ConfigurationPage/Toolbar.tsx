import React from "react";
import "./css/Toolbar.css";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

enum Page {
  WIDGETS,
  GATEWAYS,
  PAYMENTPAGE,
  HISTORY
}

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="toolbar">
      <button
        className={`toolbar-button ${page === Page.WIDGETS ? "active" : ""}`}
        onClick={() => navigate(`/configuration/widgets`)}
      >
        <span className="material-symbols-sharp">widgets</span>
        <span className="toolbar-button-title">{t("menu-widgets")}</span>
      </button>
      <button
        className={`toolbar-button ${
          page === Page.HISTORY ? "active" : ""
        }`}
        onClick={() => navigate(`/configuration/history-page`)}
      >
        <span className="material-symbols-sharp">history</span>
        <span className="toolbar-button-title">{t("menu-history")}</span>
      </button>
      <button
        className={`toolbar-button ${
          page === Page.PAYMENTPAGE ? "active" : ""
        }`}
        onClick={() => navigate(`/configuration/payment-page`)}
      >
        <span className="material-symbols-sharp">language</span>
        <span className="toolbar-button-title">{t("menu-payment-page-config")}</span>
      </button>
    </div>
  );
}

export { Page };
