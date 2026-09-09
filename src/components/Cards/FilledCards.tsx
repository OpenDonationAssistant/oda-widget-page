import { observer } from "mobx-react-lite";
import { Button, Flex, Switch } from "antd";
import { Card, CardList, CardTitle } from "./CardsComponent";
import CloseIcon from "../../icons/CloseIcon";
import classes from "./FilledCards.module.css";

export interface CardData {
  id: string;
  title: string;
  enabled: boolean;
}

export interface CardsStore {
  items: CardData[];
  remove(id: string): void;
}

export const FilledCards = observer(({ store }: { store: CardsStore }) => {
  return (
    <CardList>
      {store.items.map((card) => (
        <Card key={card.id}>
          <CardTitle>{card.title}</CardTitle>
          <Flex align="center" gap={9}>
            <Switch
              checked={card.enabled}
              onChange={(checked) => {
                card.enabled = checked;
              }}
            />
            <Button
              className={`${classes.deletebutton} oda-icon-button`}
              onClick={() => {
                store.remove(card.id);
              }}
            >
              <CloseIcon color="white" />
            </Button>
          </Flex>
        </Card>
      ))}
    </CardList>
  );
});
