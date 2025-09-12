import { Flex } from "antd";
import classes from "./HistoryItem.module.css";
import DonationGoalIcon from "../../icons/DonationGoalIcon";
import { observer } from "mobx-react-lite";
import SubActionButton from "../../components/SubActionButton/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { publish } from "../../socket";
import SongIcon from "../../icons/SongIcon";
import { HistoryItem } from "./HistoryStore";
import ReelIcon from "../../icons/ReelIcon";

function interruptAlert(conf: any) {
  publish(conf.topic.alertWidgetCommans, {
    command: "interrupt",
  });
}

function repeatAlert(topic: string, data: HistoryItem) {
  publish(topic, {
    id: data.originId,
    nickname: data.nickname,
    message: data.message,
    amount: data.amount,
    force: true,
  });
}

const Description = observer(({ item }: { item: HistoryItem }) => {
  const { conf } = useLoaderData() as WidgetData;

  return (
    <Flex vertical className="full-width" gap={9}>
      <div className={`${classes.message}`}>{item.message}</div>
      <Flex className="full-width" wrap gap={9}>
        {item.attachments?.map((attach) => (
          <Flex
            key={attach.id}
            className={`${classes.attachment}`}
            gap={3}
            onClick={() => {
              window.open(attach.url);
            }}
          >
            <SongIcon />
            <div>{attach.title}</div>
          </Flex>
        ))}
      </Flex>
      <Flex align="center" justify="space-between" className="full-width" wrap>
        <Flex align="center" gap={6}>
          <div className={classes.timestamp}>{item.time}</div>
          <div className={`${classes.system}`}>{item.system ?? "ODA"}</div>
        </Flex>
        <Flex align="center" justify="flex-end">
          <Flex align="center" justify="flex-end" gap={9}>
            {item.active && (
              <SubActionButton
                onClick={() => {
                  item.active = false;
                  interruptAlert(conf);
                }}
              >
                Прервать
              </SubActionButton>
            )}
            {!item.active && (
              <SubActionButton
                onClick={() => {
                  repeatAlert(conf.topic.alerts, item);
                }}
              >
                Повторить
              </SubActionButton>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});

export const HistoryItemComponent = observer(
  ({ item }: { item: HistoryItem }) => {
    return (
      <Flex
        vertical
        className={`${classes.item} ${item.active ? classes.active : ""}`}
        justify="space-between"
      >
        <Flex justify="space-between">
          <Flex align="center" gap={3}>
            <span className="material-symbols-sharp" style={{ color: "var(--oda-color-1000)" }}>payments</span>
            <span className={classes.title}>
              <span className={`${classes.amount}`}>
                {item.amount?.major}
                {`\u20BD`}
              </span>
              <span> от {item.nickname ?? "Аноним"}</span>
            </span>
          </Flex>
          <Flex gap={6}>
            {item.rouletteResults && item.rouletteResults.length > 0 && (
              <Flex align="center" className={`${classes.goals}`} gap={6}>
                <ReelIcon />
                <div className={`${classes.rouletteresult}`}>
                  {item.rouletteResults?.map((result) => result.title)}
                </div>
              </Flex>
            )}
            {item.goals && item.goals.length > 0 && (
              <Flex align="center" className={`${classes.goals}`} gap={6}>
                <DonationGoalIcon />
                <div>{item.goals?.map((goal) => goal.goalTitle)}</div>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Description item={item} />
      </Flex>
    );
  },
);
