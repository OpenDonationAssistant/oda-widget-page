import { Button, Flex, Switch, Tabs } from "antd";
import { observer } from "mobx-react-lite";
import classes from "./CommandsRewardsPage.module.css";
import { EditableString } from "../../components/RenamableLabel/EditableString";
import { AddListItemButton } from "../../components/List/List";
import { Command, useCommandsStore } from "./CommandsStore";
import { Reward, useRewardsStore } from "./RewardsStore";
import CloseIcon from "../../icons/CloseIcon";
import { FilledList, ListItemData } from "../../components/List/FilledList";

const CommandComponent = observer(({ command }: { command: ListItemData }) => {
  const { store } = useCommandsStore();

  return (
    <Flex
      className={`${classes.item} full-width`}
      justify="space-between"
      align="center"
    >
      <Flex style={{ flexGrow: 1 }}>
        <EditableString
          label={command.title}
          onChange={(value) => {
            command.title = value;
          }}
        />
      </Flex>
      <Flex align="center" gap={9}>
        <Switch
          checked={command.enabled}
          onChange={(checked) => {
            command.enabled = checked;
          }}
        />
        <Button
          className={`${classes.deletebutton} oda-icon-button`}
          onClick={() => {
            store.removeItem(command.id);
          }}
        >
          <CloseIcon color="white" />
        </Button>
      </Flex>
    </Flex>
  );
});

const CommandsList = observer(() => {
  const { store } = useCommandsStore();

  return (
    <Flex vertical className={`${classes.container}`} gap={3}>
      {store.items.map((command) => (
        <CommandComponent key={command.id} command={command} />
      ))}
      <AddListItemButton
        label="button-add-command"
        onClick={() => {
          store.addItem();
        }}
      />
    </Flex>
  );
});

const RewardComponent = observer(({ reward }: { reward: ListItemData }) => {
  const { store } = useRewardsStore();

  return (
    <Flex
      className={`${classes.item} full-width`}
      justify="space-between"
      align="center"
    >
      <Flex style={{ flexGrow: 1 }}>
        <EditableString
          label={reward.title}
          onChange={(value) => {
            reward.title = value;
          }}
        />
      </Flex>
      <Flex align="center" gap={9}>
        <Switch
          checked={reward.enabled}
          onChange={(checked) => {
            reward.enabled = checked;
          }}
        />
        <Button
          className={`${classes.deletebutton} oda-icon-button`}
          onClick={() => {
            store.removeItem(reward.id);
          }}
        >
          <CloseIcon color="white" />
        </Button>
      </Flex>
    </Flex>
  );
});

const RewardsList = observer(() => {
  const { store } = useRewardsStore();

  return (
    <Flex vertical className={`${classes.container}`} gap={3}>
      {store.items.map((reward) => (
        <RewardComponent key={reward.id} reward={reward} />
      ))}
      <AddListItemButton
        label="button-add-reward"
        onClick={() => {
          store.addItem();
        }}
      />
    </Flex>
  );
});

const CommandsRewardsPage = observer(() => {
  const commands = useCommandsStore().store;
  const rewards = useRewardsStore().store;

  return (
    <>
      <h1>Команды и награды</h1>
      <Tabs
        type="card"
        items={[
          {
            label: "Команды",
            key: "commands",
            children: <FilledList store={commands} />,
          },
          {
            label: "Награды",
            key: "rewards",
            children: <FilledList store={rewards} />,
          },
        ]}
      />
    </>
  );
});

export default CommandsRewardsPage;
