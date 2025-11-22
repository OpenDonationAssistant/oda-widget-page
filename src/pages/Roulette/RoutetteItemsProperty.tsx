import { observer } from "mobx-react-lite";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { ReactNode, useState } from "react";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { RouletteItem, RouletteItemData } from "../../stores/ReelStore";
import { List, ListItem } from "../../components/List/List";
import CollapseLikeButton from "../../components/Button/CollapseLikeButton";
import { Flex, Input } from "antd";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import classes from "./RoutetteItemsProperty.module.css";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";
import { uuidv7 } from "uuidv7";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import SmallLabeledContainer from "../../components/SmallLabeledContainer/SmallLabeledContainer";
import {
  DEFAULT_IMAGE_PROPERTY_VALUE,
  ImagePropertyComponent,
} from "../../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { ColorPropertyComponent } from "../../components/ConfigurationPage/widgetproperties/ColorPropertyComponent";
import { DEFAULT_COLOR_PROPERTY_VALUE } from "../../components/ConfigurationPage/widgetproperties/ColorProperty";

const RouletteItemComponent = observer(({ item }: { item: RouletteItem }) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <Flex className={`${classes.itemcontainer}`} vertical>
      <ListItem
        first={<div>{item.data.name}</div>}
        second={
          <Flex align="center" gap={3}>
            <BorderedIconButton onClick={() => item.delete()}>
              <CloseIcon color="#FF8888" />
            </BorderedIconButton>
            {opened && <ArrowUp />}
            {!opened && <ArrowDown />}
          </Flex>
        }
        onClick={() => {
          setOpened((old) => !old);
        }}
      />
      {opened && (
        <Flex vertical gap={12} className={`${classes.itemsettings}`}>
          <LabeledContainer displayName="Название лота">
            <Input
              value={item.data.name}
              onChange={(e) => {
                item.data.name = e.target.value;
              }}
            />
          </LabeledContainer>
          <LabeledContainer displayName="Вероятность выпадения">
            <SmallLabeledContainer displayName="Вес">
              <InputNumber
                value={item.data.weight}
                onChange={(e) => (item.data.weight = e)}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="Итоговая вероятность">
              <div>{item.probability}%</div>
            </SmallLabeledContainer>
          </LabeledContainer>
          <ColorPropertyComponent
            property={{
              value: item.data.backgroundColor,
              displayName: "Фон",
            }}
            onChange={(updated) => (item.data.backgroundColor = updated)}
          />
          <ImagePropertyComponent
            displayName="Фоновое изображение"
            value={item.data.backgroundImage}
          />
        </Flex>
      )}
    </Flex>
  );
});

const RouletteItemsPropertyComponent = observer(
  ({ property }: { property: RouletteItemsProperty }) => {
    return (
      <List>
        {property.items.map((item, index) => (
          <RouletteItemComponent key={index} item={item} />
        ))}
        <CollapseLikeButton
          onClick={() => {
            property.addRouletteItem();
          }}
        >
          Добавить лот
        </CollapseLikeButton>
      </List>
    );
  },
);

export class RouletteItemsProperty extends DefaultWidgetProperty<
  RouletteItemData[]
> {
  constructor() {
    super({
      name: "roulette-items",
      value: [
        {
          id: "1",
          name: "Час супер седюсера",
          weight: 1,
          backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
          backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE
        },
        {
          id: "2",
          name: "Кусок из детского видео",
          weight: 1,
          backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
          backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE
        },
        {
          id: "3",
          name: "Какой-то вопрос",
          weight: 1,
          backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
          backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE
        },
      ],
      displayName: "Лоты",
    });
  }

  public copy() {
    return new RouletteItemsProperty();
  }

  public get items(): RouletteItem[] {
    return this.value.map((item) => new RouletteItem(item, this));
  }

  public addRouletteItem() {
    this.value.push({
      id: uuidv7(),
      name: "",
      weight: 1,
      backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
      backgroundImage: DEFAULT_IMAGE_PROPERTY_VALUE,
    });
  }

  public deleteRouletteItem(id: string) {
    this.value = this.value.filter((item) => item.id !== id);
  }

  markup(): ReactNode {
    return <RouletteItemsPropertyComponent property={this} />;
  }
}
