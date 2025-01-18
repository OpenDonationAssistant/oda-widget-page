import ODALogo from "../ODALogo/ODALogo";
import { Dropdown } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import classes from "./Header.module.css";
import { useTranslation } from "react-i18next";
import { log } from "../../logging";

function logout() {
  localStorage.removeItem("login");
  localStorage.removeItem("password");
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  window.location.replace("/");
}

export default function Header({}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const { t, i18n } = useTranslation();

  log.debug({ language: i18n.resolvedLanguage });

  const changeLang = (l: string) => {
    i18n.changeLanguage(l);
  };

  return (
    <div className={`${classes.headercontainer}`}>
      <ODALogo />
      <div className={`${classes.buttons}`}>
        <a onClick={(e) => window.open("https://t.me/opendonationassistant")}>
          <img width={25} height={25} src="/icons/telegram.png" />
        </a>
        <a href="https://oda.digital/news">
          <span className="material-symbols-sharp">news</span>
        </a>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "en",
                label: "En",
                onClick: () => changeLang("en"),
              },
              {
                key: "ru",
                label: "Ru",
                onClick: () => changeLang("ru"),
              },
            ],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <span className="material-symbols-sharp">language</span>
          </a>
        </Dropdown>
        <Dropdown
          trigger={["click"]}
          className={`${classes.account}`}
          menu={{
            items: [
              {
                key: "logout",
                label: t("button-logout"),
                onClick: logout,
              },
            ],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <span className="material-symbols-sharp">person</span>
            {recipientId}
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
