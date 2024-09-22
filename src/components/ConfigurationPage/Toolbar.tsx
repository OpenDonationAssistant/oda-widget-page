import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import classes from "./Toolbar.module.css";

enum Page {
  WIDGETS,
  GATEWAYS,
  PAYMENTPAGE,
  HISTORY,
}

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={`${classes.toolbar}`}>
      <button
        className={`${classes.toolbarbutton} ${
          page === Page.WIDGETS ? "selected" : "inactive"
        }`}
        onClick={() => navigate(`/configuration/widgets`)}
      >
        <span className="material-symbols-sharp">widgets</span>
        <span className={`${classes.toolbarbuttontitle}`}>
          {t("menu-widgets")}
        </span>
      </button>
      <button
        className={`${classes.toolbarbutton} ${
          page === Page.HISTORY ? "selected" : "inactive"
        }`}
        onClick={() => navigate(`/configuration/history-page`)}
      >
        <span className="material-symbols-sharp">history</span>
        <span className={`${classes.toolbarbuttontitle}`}>
          {t("menu-history")}
        </span>
      </button>
      <button
        className={`${classes.toolbarbutton} ${
          page === Page.PAYMENTPAGE ? "selected" : "inactive"
        }`}
        onClick={() => navigate(`/configuration/payment-page`)}
      >
        <span className="material-symbols-sharp">language</span>
        <span className={`${classes.toolbarbuttontitle}`}>
          {t("menu-payment-page-config")}
        </span>
      </button>
    </div>
  );
}

export { Page };
