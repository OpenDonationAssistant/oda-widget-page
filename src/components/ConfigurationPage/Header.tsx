import React, { useEffect, useState } from "react";
import ODALogo from "../ODALogo/ODALogo";
import { Dropdown } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import classes from "./Header.module.css";
import { useTranslation } from "react-i18next";

function logout(){
  localStorage.removeItem("login");
  localStorage.removeItem("password");
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  window.location.replace("/");
}

export default function Header({}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(
    () => localStorage.getItem("language") ?? "ru",
  );

  useEffect(() => {
    i18n.changeLanguage(lang);
  },[i18n, lang]);

  const changeLang = (l: string) => {
    setLang(l);
    localStorage.setItem("language", l);
  };

  return (
    <>
      <div className={`${classes.headercontainer}`}>
        <ODALogo />
        <div className={`${classes.buttons}`}>
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
              <span>{lang === "ru" ? "Ru" : "En"}</span>
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
                  onClick: logout
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
    </>
  );
}
