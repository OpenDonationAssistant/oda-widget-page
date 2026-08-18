import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import classes from "./ApiPage.module.css";
import {
  Card,
  CardButton,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { AddAppWizard } from "./AddAppWizard";
import { AppStore, DefaultAppStore } from "../../stores/AppStore";
import { useState } from "react";

export const ApiPage = observer(() => {
  const { t } = useTranslation();
  const [store, setStore] = useState<AppStore>(
    new DefaultAppStore(localStorage.getItem("access-token") ?? ""),
  );

  return (
    <>
      <h1>{t("menu-api")}</h1>
      <div className={`${classes.section}`}>
        <h3>Документация</h3>
        <a
          className={`${classes.href}`}
          href="https://opendonationassistant.mintlify.app/"
        >
          Описание API
        </a>
        <a
          className={`${classes.href}`}
          href="https://github.com/opendonationassistant"
        >
          GitHub
        </a>
      </div>
      <div className={`${classes.section}`}>
        <h3>Мои приложения</h3>
        <CardList>
          {store.apps.map((app) => (
            <Card key={app.clientId}>
              <CardTitle>{app.name}</CardTitle>
              <CardButton onClick={() => {}}>Удалить</CardButton>
            </Card>
          ))}
          <AddAppWizard appStore={store} />
        </CardList>
      </div>
    </>
  );
});
