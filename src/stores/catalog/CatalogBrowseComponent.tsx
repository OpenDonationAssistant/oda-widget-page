import { useContext, useEffect, useState } from "react";
import { CatalogItem, CatalogStore, DefaultCatalogStore } from "./CatalogStore";
import {
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import { Card, CardList } from "../../components/Cards/CardsComponent";
import classes from "./CatalogBrowseComponent.module.css";
import { Flex } from "antd";
import SecondaryButton from "../../components/Button/SecondaryButton";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { VoiceControllerContext } from "../../logic/voice/VoiceController";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import RunIcon from "../../icons/RunIcon";

const ItemCard = ({
  item,
  selected,
  onClick,
}: {
  item: CatalogItem;
  selected: boolean;
  onClick: () => void;
}) => {
  const voice = useContext(VoiceControllerContext);
  switch (item.type) {
    case "static-image":
      return (
        <Card onClick={onClick} selected={selected}>
          <img src={item.url} alt="" />
        </Card>
      );
    case "static-audio":
      return (
        <Card onClick={onClick} selected={selected}>
          <Flex gap={9} align="center">
            <BorderedIconButton onClick={() => voice.playSource(item.url)}>
              <RunIcon />
            </BorderedIconButton>
            <div className={`${classes.filename}`}>{item.name}</div>
          </Flex>
        </Card>
      );
    default:
      return <></>;
  }
};

export const CatalogBrowse = ({
  category,
  onChange,
}: {
  category: string;
  onChange: (item: CatalogItem) => void;
}) => {
  const [catalog] = useState<CatalogStore>(() => {
    return new DefaultCatalogStore(category);
  });
  const [page, setPage] = useState<number>(0);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const modalState = useContext(ModalStateContext);

  useEffect(() => {
    catalog.loadPage(page);
  }, [page]);

  return (
    <Overlay>
      <Panel>
        <Title>Галерея</Title>
        <CardList className={`withscroll`}>
          {catalog.items.slice(0, page * 12 + 12).map((item) => (
            <ItemCard
              item={item}
              selected={item.id === selected?.id}
              key={item.id}
              onClick={() => {
                setSelected(item);
              }}
            />
          ))}
        </CardList>
        <Flex className={`${classes.browsebuttons}`} justify="space-between">
          <SecondaryButton
            onClick={() => {
              setPage(0);
              setSelected(null);
              modalState.show = false;
            }}
          >
            Отменить
          </SecondaryButton>
          <SecondaryButton onClick={() => setPage((old) => old + 1)}>
            Показать ещё
          </SecondaryButton>
          <PrimaryButton
            disabled={!selected}
            onClick={() => {
              setPage(0);
              modalState.show = false;
              if (selected) {
                onChange(selected);
              }
            }}
          >
            Принять
          </PrimaryButton>
        </Flex>
      </Panel>
    </Overlay>
  );
};
