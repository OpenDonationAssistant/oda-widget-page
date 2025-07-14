import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import classes from "./GuidesPage.module.css";

export const GuidesPage = observer(({}) => {
  return (
    <>
      <h1>Гайды</h1>
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
          <div className={`${classes.subtitle}`}>Автополоска на платформе ODA</div>
          <div>
            Гайд, описывающий как можно автоматизировать виджет "Цель сбора" на
            примере настроек для ивента RGG Land: автоматическое увеличение
            цели, сброс собранной суммы, ведение счетчика.
          </div>
        </Flex>
      </Flex>
    </>
  );
});
