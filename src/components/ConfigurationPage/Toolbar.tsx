import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import classes from "./Toolbar.module.css";
import style from "./Toolbar-theme-2.module.css";
import NewsComponent from "../../pages/Events/NewsComponent";
import WidgetsIcon from "../../icons/WidgetsIcon";
import HistoryIcon from "../../icons/HistoryIcon";
import RubleIcon from "../../icons/RubleIcon";
import AutomationIcon from "../../icons/AutomationIcon";
import { ReactNode } from "react";
import WalletIcon from "../../icons/WalletIcon";

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
  active: ReactNode;
  nonactive: ReactNode;
  label: string;
}

const buttons: Section[] = [
  {
    page: Page.WIDGETS,
    url: "/configuration/widgets",
    active: <WidgetsIcon color="var(--oda-color-800)" />,
    nonactive: <WidgetsIcon color="var(--oda-color-500)" />,
    label: "menu-widgets",
  },
  {
    page: Page.HISTORY,
    url: "/configuration/history-page",
    active: <HistoryIcon color="var(--oda-color-800)" />,
    nonactive: <HistoryIcon color="var(--oda-color-500)" />,
    label: "menu-history",
  },
  {
    page: Page.PAYMENTPAGE,
    url: "/configuration/payment-page",
    active: <RubleIcon color="var(--oda-color-800)" />,
    nonactive: <RubleIcon color="var(--oda-color-500)" />,
    label: "menu-payment-page-config",
  },
  //{
  //  page: Page.GATEWAYS,
  //  url: "/configuration/gateways",
  //  active: <WalletIcon color="var(--oda-color-800)" />,
  //  nonactive: <WalletIcon color="var(--oda-color-500)" />,
  //  label: "menu-gateways",
  //},
  //{
  //  page: Page.INTEGRATIONS,
  //  url: "/configuration/integrations",
  //  active: <AutomationIcon color="var(--oda-color-800)" />,
  //  nonactive: <AutomationIcon color="var(--oda-color-500)" />,
  //  label: "menu-integrations",
  //},
  {
    page: Page.AUTOMATION,
    url: "/configuration/automation-page",
    active: <AutomationIcon color="var(--oda-color-800)" />,
    nonactive: <AutomationIcon color="var(--oda-color-500)" />,
    label: "menu-automation",
  },
  //{
  //  page: Page.GUIDES,
  //  url: "/configuration/guides",
  //  active: <AutomationIcon color="var(--oda-color-800)" />,
  //  nonactive: <AutomationIcon color="var(--oda-color-500)" />,
  //  label: "menu-guides",
  //},
];

export default function Toolbar({ page }: { page: Page }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={`${style.toolbar}`}>
      {buttons.map((button) => (
        <button
          key={button.label}
          className={`${style.button} ${
            page === button.page ? "selected" : "inactive"
          }`}
          onClick={() => navigate(button.url)}
        >
          {page === button.page ? button.active : button.nonactive}
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
