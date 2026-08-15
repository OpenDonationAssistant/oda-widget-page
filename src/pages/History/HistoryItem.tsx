import { Flex } from "antd";
import classes from "./HistoryItem.module.css";
import DonationGoalIcon from "../../icons/DonationGoalIcon";
import { observer } from "mobx-react-lite";
import SubActionButton from "../../components/Button/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { publish } from "../../socket";
import SongIcon from "../../icons/SongIcon";
import { HistoryItem, HistoryStoreContext } from "./HistoryStore";
import ReelIcon from "../../icons/ReelIcon";
import RunIcon from "../../icons/RunIcon";
import BoostyIcon from "../../icons/BoostyIcon";
import TwitchIcon from "../../icons/TwitchIcon";
import MemeAlertsIcon from "../../icons/MemeAlertsIcon";
import DonatePayIcon from "../../icons/DonatePayIcon";
import ODAIcon from "../../icons/ODAIcon";
import DonationAlertsIcon from "../../icons/DonationAlertsIcon";
import DonateXIcon from "../../icons/DonateXIcon";
import { useContext } from "react";
import { HistoryWidgetSettingsContenxt } from "./HistoryWidgetSettings";
import KickIcon from "../../icons/KickIcon";
import VKLiveIcon from "../../icons/VKLiveIcon";

function interruptAlert(conf: any) {
  publish(conf.topic.alertWidgetCommans, {
    command: "interrupt",
  });
}

const Description = observer(({ item }: { item: HistoryItem }) => {
  const { conf } = useLoaderData() as WidgetData;
  const historyStore = useContext(HistoryStoreContext);
  const settings = useContext(HistoryWidgetSettingsContenxt);

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
        {settings.showRequests.value &&
          item.attachments?.map((attach) => (
            <Flex
              key={attach.id}
              className={`${classes.attachment}`}
              gap={3}
              onClick={() => {
                window.open(attach.url);
              }}
            >
              <SongIcon />
              <div style={{ fontSize: `${settings.musicFontSize.value}px` }}>
                {attach.title}
              </div>
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
            <div style={{ fontSize: `${settings.actionsFontSize.value}px` }}>
              {action.amount}x {action.name}
            </div>
          </Flex>
        ))}
      </Flex>
      <Flex align="center" justify="space-between" className="full-width" wrap>
        {!item.active && (
          <Flex align="center" gap={6}>
            <div className={classes.timestamp}>{item.time}</div>
            <div className={`${classes.system}`}>{item.system ?? "ODA"}</div>
          </Flex>
        )}
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
                  historyStore?.alert(item);
                }}
                icon={<span className="material-symbols-sharp">replay</span>}
              >
                <div>Повторить</div>
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
    const settings = useContext(HistoryWidgetSettingsContenxt);

    switch (item.event) {
      case "subscription-gift":
        header = (
          <Flex align="center" gap={3}>
            {item.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "VKLive" && (
              <VKLiveIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>
                {item.nickname ?? "Аноним"} подарил подписку{" "}
              </span>
              <span className={`${classes.levelname}`}>{item.levelName}</span>
            </span>
          </Flex>
        );
        break;
      case "subscription":
        header = (
          <Flex align="center" gap={3}>
            {item.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "VKLive" && (
              <VKLiveIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
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
              <span
                className={classes.title}
                style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
              >
                <span> {item.nickname ?? "Аноним"} купил </span>
                <span className={`${classes.memecount}`}>{item.count}</span>
                <span> мемкоинов</span>
              </span>
            </Flex>
          );
        } else {
          header = (
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              {item.system === "DonatePay" && (
                <DonatePayIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {item.system === "DonatePay.eu" && (
                <DonatePayIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {item.system === "DonateX" && (
                <DonateXIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {item.system === "DonationAlerts" && (
                <DonationAlertsIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {item.system === "ODA" && (
                <ODAIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              <span className={`${classes.amount}`}>
                {item.amount?.major}
                {`\u20BD`}
              </span>
              <span className={`${classes.from}`}>от</span>
              <span className={`${classes.nickname}`}>
                {item.nickname ?? "Аноним"}
              </span>
            </span>
          );
        }
        break;
      case "follow":
        header = (
          <Flex align="center" gap={3}>
            {item.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "VKLive" && (
              <VKLiveIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>{item.nickname ?? "Аноним"} зафолловился</span>
            </span>
          </Flex>
        );
        break;
      case "raid":
        header = (
          <Flex align="center" gap={3}>
            {item.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {item.system === "VKLive" && (
              <VKLiveIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>
                Рейд от{" "}
                <span style={{ color: "var(--oda-primary-color)" }}>
                  {item.nickname ?? "Аноним"}
                </span>
              </span>
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
        <Flex wrap justify="space-between">
          {header}
          <Flex gap={6}>
            {item.rouletteResults && item.rouletteResults.length > 0 && (
              <Flex align="center" className={`${classes.goals}`} gap={6}>
                <ReelIcon />
                <div
                  className={`${classes.rouletteresult}`}
                  style={{ fontSize: `${settings.reelFontSize.value}px` }}
                >
                  {item.rouletteResults?.map((result) => result.title)}
                </div>
              </Flex>
            )}
            {settings.showGoalsProperty.value &&
              item.goals &&
              item.goals.length > 0 && (
                <Flex align="center" className={`${classes.goals}`} gap={6}>
                  <DonationGoalIcon />
                  <div style={{ fontSize: `${settings.goalFontSize.value}px` }}>
                    {item.goals?.map((goal) => goal.goalTitle)}
                  </div>
                </Flex>
              )}
          </Flex>
        </Flex>
        <Description item={item} />
      </Flex>
    );
  },
);
