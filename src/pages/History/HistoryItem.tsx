import { Flex, List } from "antd";
import { HistoryItemData } from "@opendonationassistant/oda-history-service-client";
import classes from "./HistoryItem.module.css";
import DonationGoalIcon from "../../icons/DonationGoalIcon";
import { observer } from "mobx-react-lite";
import SubActionButton from "../../components/SubActionButton/SubActionButton";
import RunIcon from "../../icons/RunIcon";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { publish } from "../../socket";
import { uuidv7 } from "uuidv7";
import SongIcon from "../../icons/SongIcon";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

function repeatAlert(topic: string, data: HistoryItemData) {
  publish(topic, {
    id: uuidv7(), // TODO: сделать опциональным
    nickname: data.nickname,
    message: data.message,
    amount: data.amount,
  });
}

const Description = observer(({ item }: { item: HistoryItemData }) => {
  //<IconButton onClick={() => {}}>
  //  <CloseIcon color="#FF8888" />
  //</IconButton>
  const { conf } = useLoaderData() as WidgetData;

  return (
    <Flex vertical className="full-width" gap={9}>
      <div className={`${classes.message}`}>{item.message}</div>
      <Flex className="full-width" wrap gap={9}>
        {item.attachments?.map((attach) => (
          <Flex key={attach.id} className={`${classes.attachment}`} gap={3}
              onClick={() => {
                window.open(attach.url);
              }}
          >
            <SongIcon />
            <div
            >
              {attach.title}
            </div>
          </Flex>
        ))}
      </Flex>
      <Flex align="center" justify="space-between" className="full-width">
        <span className={classes.timestamp}>
          {dateTimeFormat.format(new Date(item.authorizationTimestamp))}
        </span>
        <Flex align="center" justify="flex-end" className="full-width">
          <Flex align="center" justify="flex-end" gap={9}>
            <SubActionButton
              onClick={() => {
                repeatAlert(conf.topic.alerts, item);
              }}
            >
              <span style={{ marginLeft: "3px" }}>Повторить</span>
            </SubActionButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});

export default function HistoryItem({ item }: { item: HistoryItemData }) {
  return (
    <>
      <List.Item>
        <List.Item.Meta
          title={
            <Flex justify="space-between">
              <span className={classes.title}>
                <span className={`${classes.amount}`}>
                  {item.amount?.major}
                  {`\u20BD`}
                </span>
                <span> от {item.nickname ?? "Аноним"}</span>
              </span>
              {item.goals && (
                <Flex align="center" className={`${classes.goals}`} gap={12}>
                  <DonationGoalIcon />
                  <div>{item.goals?.map((goal) => goal.goalTitle)}</div>
                </Flex>
              )}
            </Flex>
          }
          description={<Description item={item} />}
        />
      </List.Item>
    </>
  );
}
