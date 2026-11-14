import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import classes from "./GuidesPage.module.css";

export const GuidesPage = observer(() => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("menu-guides")}</h1>
      <Flex vertical className={`${classes.cards}`}>
        <Flex
          className={`${classes.card}`}
          vertical
          onClick={() =>
            window.open(
              "https://boosty.to/shnumi/posts/9096dae2-e11e-4753-bf30-4d343625180a?share=post_link",
            )
          }
        >
          <div className={`${classes.subtitle}`}>{t("guides-oda-autobar-title")}</div>
          <div>
            {t("guides-oda-autobar-description")}
          </div>
        </Flex>
      </Flex>
    </>
  );
});
