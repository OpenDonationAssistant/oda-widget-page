import { Flex } from "antd";
import classes from "./HistoryItem.module.css";
import DonationGoalIcon from "../../icons/DonationGoalIcon";
import { observer } from "mobx-react-lite";
import SubActionButton from "../../components/Button/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { publish } from "../../socket";
import SongIcon from "../../icons/SongIcon";
import { HistoryItem } from "./HistoryStore";
import ReelIcon from "../../icons/ReelIcon";
import RunIcon from "../../icons/RunIcon";
import BoostyIcon from "../../icons/BoostyIcon";
import MemeAlertsIcon from "../../icons/MemeAlertsIcon";

function interruptAlert(conf: any) {
  publish(conf.topic.alertWidgetCommans, {
    command: "interrupt",
  });
}

interface Variable {
  name: string;
  value: any;
}

function repeatAlert(topic: string, data: HistoryItem) {
  const variables: Variable[] = [
    {
      name: "originId",
      value: data.originId
    },
    {
      name: "amount",
      value: String(data.amount.major),
    },
    {
      name: "nickname",
      value: String(data.nickname),
    },
    {
      name: "message",
      value: String(data.message),
    },
    {
      name: "event",
      value: String(data.event),
    },
    {
      name: "system",
      value: String(data.system),
    },
    {
      name: "levelName",
      value: String(data.levelName),
    },
    {
      name: "force",
      value: true,
    }
  ];
  publish(topic, {
    type: "Alert",
    variables: variables,
  });
}

const Description = observer(({ item }: { item: HistoryItem }) => {
  const { conf } = useLoaderData() as WidgetData;

  let message;
  switch (item.event) {
    case "payment":
      message =
        item.system === "MemeAlerts" ? (
          <></>
        ) : (
          <div className={`${classes.message}`}>{item.message}</div>
        );
      break;
    default:
      message = <></>;
  }

  return (
    <Flex vertical className="full-width" gap={9}>
      {message}
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
      <Flex className="full-width" wrap gap={9}>
        {item.actions?.map((action) => (
          <Flex
            key={action.id}
            className={`${classes.attachment}`}
            align="center"
            gap={3}
          >
            <RunIcon />
            <div>
              {action.amount}x {action.name}
            </div>
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
                  repeatAlert(conf.topic.events, item);
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
    let header;
    console.log("item", item);
    switch (item.event) {
      case "subscription":
        header = (
          <Flex align="center" gap={3}>
            <BoostyIcon className={classes.icon} />
            <span className={classes.title}>
              <span>{item.nickname ?? "Аноним"} купил подписку </span>
              <span className={`${classes.levelname}`}>{item.levelName}</span>
            </span>
          </Flex>
        );
        break;
      case "payment":
        if (item.system === "MemeAlerts") {
          header = (
            <Flex align="center" gap={3}>
              <MemeAlertsIcon
                color="var(--oda-primary-color)"
                className={`${classes.icon}`}
              />
              <span className={classes.title}>
                <span> {item.nickname ?? "Аноним"} купил </span>
                <span className={`${classes.memecount}`}>{item.count}</span>
                <span> мемкоинов</span>
              </span>
            </Flex>
          );
        } else {
          header = (
            <Flex align="center" gap={3}>
              <span className={`material-symbols-sharp ${classes.icon}`}>
                payments
              </span>
              <span className={classes.title}>
                <span className={`${classes.amount}`}>
                  {item.amount?.major}
                  {`\u20BD`}
                </span>
                <span> от {item.nickname ?? "Аноним"}</span>
              </span>
            </Flex>
          );
        }
        break;
      case "follow":
        header = (
          <Flex align="center" gap={3}>
            <BoostyIcon className={classes.icon} />
            <span className={classes.title}>
              <span>{item.nickname ?? "Аноним"} зафолловился</span>
            </span>
          </Flex>
        );
        break;
      default:
        break;
    }
    return (
      <Flex
        vertical
        className={`${classes.item} ${item.active ? classes.active : ""}`}
        justify="space-between"
      >
        <Flex justify="space-between">
          {header}
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
