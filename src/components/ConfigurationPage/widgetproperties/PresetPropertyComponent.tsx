import { Button, Flex } from "antd";
import { Image } from "antd";
import classes from "./PresetProperty.module.css";
import { Trans } from "react-i18next";
import { useRequest } from "ahooks";
import { PresetProperty } from "./PresetProperty";

export default function PresetPropertyComponent({
  property,
}: {
  property: PresetProperty;
}) {
  const { data } = useRequest(() => property.load());

  return (
    <>
      <div className={`${classes.guide}`}>
        Нажмите кнопку "Применить" под понравившимся шаблоном, чтобы скопировать
        все настройки с него в этот виджет. <br />
        Все настройки можно поменять в соседних вкладках, а если хотите вернуть
        обратно, как было в шаблоне, - просто снова нажмите "Применить".
      </div>
      <Flex className={`${classes.grid}`} gap={10} wrap={true}>
        {data &&
          data.map((preset) => (
            <Flex vertical={true} gap={10}>
              <Image.PreviewGroup>
                <Image
                  width={200}
                  height={120}
                  className={`${classes.preview}`}
                  src={preset.showcase}
                />
              </Image.PreviewGroup>
              <Button
                onClick={() => {
                  property.apply(preset);
                }}
                className="oda-btn-default"
              >
                <Flex
                  className="full-height"
                  justify="center"
                  align="center"
                  gap={3}
                >
                  <span className="material-symbols-sharp">check</span>
                  <div>
                    <Trans i18nKey="button-apply" />
                  </div>
                </Flex>
              </Button>
            </Flex>
          ))}
      </Flex>
    </>
  );
}
