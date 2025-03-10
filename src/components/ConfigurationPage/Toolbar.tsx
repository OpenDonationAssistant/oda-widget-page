import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import classes from "./Toolbar.module.css";

enum Page {
  WIDGETS,
  GATEWAYS,
  PAYMENTPAGE,
  HISTORY,
  AUTOMATION,
}

interface Section {
  page: Page;
  url: string;
  symbol: string;
  label: string;
}

const buttons: Section[] = [
  {
    page: Page.WIDGETS,
    url: "/configuration/widgets",
    symbol: "widgets",
    label: "menu-widgets",
  },
  {
    page: Page.HISTORY,
    url: "/configuration/history-page",
    symbol: "history",
    label: "menu-history",
  },
  {
    page: Page.PAYMENTPAGE,
    url: "/configuration/payment-page",
    symbol: "local_atm",
    label: "menu-payment-page-config",
  },
  // {
  //   page: Page.AUTOMATION,
  //   url: "/configuration/automation-page",
  //   symbol: "automation",
  //   label: "menu-automation",
  // },
];

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={`${classes.toolbar}`}>
      {buttons.map((button) => (
        <button
          key={button.label}
          className={`${classes.toolbarbutton} ${
            page === button.page ? "selected" : "inactive"
          }`}
          onClick={() => navigate(button.url)}
        >
          <span className="material-symbols-sharp">{button.symbol}</span>
          <span className={`${classes.toolbarbuttontitle}`}>
            {t(button.label)}
          </span>
        </button>
      ))}
    </div>
  );
}

export { Page };
