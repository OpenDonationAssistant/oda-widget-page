import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import classes from "./Toolbar.module.css";
import style from "./Toolbar-theme-2.module.css";
import NewsComponent from "../../pages/Events/NewsComponent";

enum Page {
  WIDGETS,
  GATEWAYS,
  PAYMENTPAGE,
  HISTORY,
  AUTOMATION,
  GUIDES,
  INTEGRATIONS,
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
  //{
  //  page: Page.INTEGRATIONS,
  //  url: "/configuration/integrations",
  //  symbol: "webhook",
  //  label: "menu-integrations",
  //},
  {
    page: Page.AUTOMATION,
    url: "/configuration/automation-page",
    symbol: "precision_manufacturing",
    label: "menu-automation",
  },
  //{
  //  page: Page.GUIDES,
  //  url: "/configuration/guides",
  //  symbol: "developer_guide",
  //  label: "menu-guides",
  //},
];

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div
      className={`${page === Page.AUTOMATION ? style.toolbar : classes.toolbar}`}
    >
      {buttons.map((button) => (
        <button
          key={button.label}
          className={`${page === Page.AUTOMATION ? style.button : classes.toolbarbutton} ${
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
      <NewsComponent />
    </div>
  );
}

export { Page };
