import React from "react";
import "./css/Toolbar.css";
import { useNavigate } from "react-router";
import ODALogo from "../ODALogo/ODALogo";

enum Page {
  WIDGETS,
  GATEWAYS,
  PAYMENTPAGE,
}

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  return (
    <div className="toolbar">
      <div className="toolbar-title">
        <ODALogo/>
      </div>
      <button
        className={`toolbar-button ${page === Page.WIDGETS ? "active" : ""}`}
        onClick={() => navigate(`/configuration/widgets`)}
      >
        <span className="material-symbols-sharp">widgets</span>
        <span className="toolbar-button-title">Widgets</span>
      </button>
      <button
        className={`toolbar-button ${
          page === Page.PAYMENTPAGE ? "active" : ""
        }`}
        onClick={() => navigate(`/configuration/payment-page`)}
      >
        <span className="material-symbols-sharp">language</span>
        <span className="toolbar-button-title">Donation page</span>
      </button>
      <button
        className={`toolbar-button ${page === Page.GATEWAYS ? "active" : ""}`}
        onClick={() => navigate(`/configuration/gateways`)}
      >
        <span className="material-symbols-sharp">credit_card</span>
        <span className="toolbar-button-title">Payment Gateways</span>
      </button>
    </div>
  );
}

export { Page };
