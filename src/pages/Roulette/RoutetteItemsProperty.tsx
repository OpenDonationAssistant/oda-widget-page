import { observer } from "mobx-react-lite";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { ReactNode, useContext, useState } from "react";
import { Flex } from "antd";
import classes from "./RoutetteItemsProperty.module.css";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import AddIcon from "../../icons/AddIcon";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";

const ItemModal = observer(() => {
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(() => new ModalState(parentModalState));

  return (
    <>
      <ModalStateContext.Provider value={modalState}>
        <Overlay>
          <Panel>
            <Title>Настройки лота</Title>
            <Flex></Flex>
          </Panel>
        </Overlay>
        <button
          onClick={() => {
            modalState.show = true;
          }}
          className={`${classes.edit}`}
        >
          Изменить
        </button>
      </ModalStateContext.Provider>
    </>
  );
});

const RouletteItemsPropertyComponent = observer(
  ({ property }: { property: RouletteItemsProperty }) => {
    return (
      <Flex gap={12} className={`full-width ${classes.list}`} wrap>
        {property.value.map((item, index) => (
          <Flex
            gap={15}
            vertical
            justify="space-between"
            key={item.id}
            className={`${classes.card}`}
          >
            <Flex justify="space-between" align="top">
              <div>{item.name}</div>
              <BorderedIconButton
                onClick={() => {
                  property.value.splice(index, 1);
                }}
              >
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            </Flex>
            <ItemModal />
          </Flex>
        ))}
        <Flex
          vertical
          justify="center"
          align="center"
          className={`${classes.addcard}`}
        >
          <AddIcon color="var(--oda-primary-color)" />
          <div>Добавить лот</div>
        </Flex>
      </Flex>
    );
  },
);

interface RouletteItem {
  id: string;
  name: string;
  weight: number;
}

export class RouletteItemsProperty extends DefaultWidgetProperty<
  RouletteItem[]
> {
  constructor() {
    super({
      name: "roulette-items",
      value: [
        {
          name: "Час супер седюсера",
          weight: 1,
        },
        {
          name: "Кусок из детского видео",
          weight: 1,
        },
        {
          name: "Какой-то вопрос",
          weight: 1,
        },
      ],
      displayName: "Лоты",
    });
  }

  public copy() {
    return new RouletteItemsProperty();
  }

  markup(): ReactNode {
    return <RouletteItemsPropertyComponent property={this} />;
  }
}
