import { observer } from "mobx-react-lite";
import { Button, Flex, Switch } from "antd";
import { List, ListItem } from "./List";
import CloseIcon from "../../icons/CloseIcon";
import classes from "./FilledList.module.css";

export interface ListItemData {
  id: string;
  title: string;
  enabled: boolean;
}

export interface ListItemsStore {
  items: ListItemData[];
  remove(id: string): void;
}

export const FilledList = observer(
  ({ store }: { store: ListItemsStore }) => {
    return (
      <List>
        {store.items.map((item) => (
          <ListItem
            key={item.id}
            first={<div>{item.title}</div>}
            second={
              <Flex align="center" gap={9}>
                <Switch
                  checked={item.enabled}
                  onChange={(checked) => {
                    item.enabled = checked;
                  }}
                />
                <Button
                  className={`${classes.deletebutton} oda-icon-button`}
                  onClick={() => {
                    store.remove(item.id);
                  }}
                >
                  <CloseIcon color="white" />
                </Button>
              </Flex>
            }
          />
        ))}
      </List>
    );
  },
);
