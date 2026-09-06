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
import { useContext, useState } from "react";
import type { ReactNode } from "react";
import { HistoryWidgetSettingsContenxt } from "./HistoryWidgetSettings";
import KickIcon from "../../icons/KickIcon";
import VKLiveIcon from "../../icons/VKLiveIcon";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";

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

function getGroupedHeader(
  event: string,
  system: string,
  items: HistoryItem[],
  settings: any,
): ReactNode {
  const count = items.length;
  const nicknames = items.map((item) => item.nickname ?? "Аноним");

  switch (event) {
    case "follow":
      return (
        <Flex align="center" gap={3}>
          {system === "Twitch" && (
            <TwitchIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "Kick" && (
            <KickIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "VKLive" && <VKLiveIcon className={classes.icon} />}
          {system === "Boosty" && <BoostyIcon className={classes.icon} />}
          <span
            className={classes.title}
            style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
          >
            <span>Новых фолловеров - {count}: </span>
            <span className={`${classes.levelname}`}>
              {nicknames.join(", ")}
            </span>
          </span>
        </Flex>
      );
    case "raid": {
      const totalViewers = items.reduce(
        (sum, item) => sum + (item.count ?? 0),
        0,
      );
      return (
        <Flex align="center" gap={3}>
          {system === "Twitch" && (
            <TwitchIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "Kick" && (
            <KickIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "VKLive" && <VKLiveIcon className={classes.icon} />}
          <span
            className={classes.title}
            style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
          >
            <span>Зарейдило {totalViewers} зрителей суммарно от </span>
            <span
              className={`${classes.levelname}`}
              style={{ color: "var(--oda-primary-color)" }}
            >
              {nicknames.join(", ")}
            </span>
          </span>
        </Flex>
      );
    }
    case "subscription":
      return (
        <Flex align="center" gap={3}>
          {system === "Twitch" && (
            <TwitchIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "Kick" && (
            <KickIcon
              color="var(--oda-primary-color)"
              className={classes.icon}
            />
          )}
          {system === "VKLive" && <VKLiveIcon className={classes.icon} />}
          {system === "Boosty" && <BoostyIcon className={classes.icon} />}
          <span
            className={classes.title}
            style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
          >
            <span>Новых подписчиков - {count}: </span>
            <span className={`${classes.levelname}`}>
              {nicknames.join(", ")}
            </span>
          </span>
        </Flex>
      );
    default:
      return null;
  }
}

export const GroupedHistoryItemComponent = observer(
  ({ groupedItems }: { groupedItems: HistoryItem[] }) => {
    const displayItem = groupedItems[0];
    const settings = useContext(HistoryWidgetSettingsContenxt);
    const [expanded, setExpanded] = useState(false);
    const header = getGroupedHeader(
      displayItem.event,
      displayItem.system,
      groupedItems,
      settings,
    );

    return (
      <Flex vertical gap={3}>
        <Flex
          vertical
          className={`${classes.item} ${displayItem.active ? classes.active : ""}`}
          justify="space-between"
          onClick={() => setExpanded((old) => !old)}
          style={{ cursor: "pointer" }}
        >
          <Flex justify="space-between" align="flex-start">
            {header}
            {expanded ? <ArrowUp /> : <ArrowDown />}
          </Flex>
        </Flex>
        {expanded && (
          <Flex vertical className={`full-width ${classes.groupeditems}`} gap={3}>
            {groupedItems.map((item, index) => (
              <SingleHistoryItemComponent key={index} displayItem={item} />
            ))}
          </Flex>
        )}
      </Flex>
    );
  },
);

export const SingleHistoryItemComponent = observer(
  ({ displayItem }: { displayItem: HistoryItem }) => {
    const settings = useContext(HistoryWidgetSettingsContenxt);
    let header;

    switch (displayItem.event) {
      case "subscription-gift":
        header = (
          <Flex align="center" gap={3}>
            {displayItem.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "VKLive" && (
              <VKLiveIcon className={classes.icon} />
            )}
            {displayItem.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>{displayItem.nickname ?? "Аноним"} подарил подписку </span>
              <span className={`${classes.levelname}`}>
                {displayItem.levelName}
              </span>
            </span>
          </Flex>
        );
        break;
      case "subscription":
        header = (
          <Flex align="center" gap={3}>
            {displayItem.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "VKLive" && (
              <VKLiveIcon className={classes.icon} />
            )}
            {displayItem.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>{displayItem.nickname ?? "Аноним"} купил подписку </span>
              <span className={`${classes.levelname}`}>
                {displayItem.levelName}
              </span>
            </span>
          </Flex>
        );
        break;
      case "payment":
        if (displayItem.system === "MemeAlerts") {
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
                <span> {displayItem.nickname ?? "Аноним"} купил </span>
                <span className={`${classes.memecount}`}>
                  {displayItem.count}
                </span>
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
              {displayItem.system === "DonatePay" && (
                <DonatePayIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {displayItem.system === "DonatePay.eu" && (
                <DonatePayIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {displayItem.system === "DonateX" && (
                <DonateXIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {displayItem.system === "DonationAlerts" && (
                <DonationAlertsIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              {displayItem.system === "ODA" && (
                <ODAIcon
                  color="var(--oda-primary-color)"
                  className={`${classes.icon}`}
                />
              )}
              <span className={`${classes.amount}`}>
                {displayItem.amount?.major}
                {`\u20BD`}
              </span>
              <span className={`${classes.from}`}>от</span>
              <span className={`${classes.nickname}`}>
                {displayItem.nickname ?? "Аноним"}
              </span>
            </span>
          );
        }
        break;
      case "follow":
        header = (
          <Flex align="center" gap={3}>
            {displayItem.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "VKLive" && (
              <VKLiveIcon className={classes.icon} />
            )}
            {displayItem.system === "Boosty" && (
              <BoostyIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>{displayItem.nickname ?? "Аноним"} зафолловился</span>
            </span>
          </Flex>
        );
        break;
      case "raid":
        header = (
          <Flex align="center" gap={3}>
            {displayItem.system === "Twitch" && (
              <TwitchIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "Kick" && (
              <KickIcon
                color="var(--oda-primary-color)"
                className={classes.icon}
              />
            )}
            {displayItem.system === "VKLive" && (
              <VKLiveIcon className={classes.icon} />
            )}
            <span
              className={classes.title}
              style={{ fontSize: `${settings.nicknameFontSize.value}px` }}
            >
              <span>
                Рейд от{" "}
                <span style={{ color: "var(--oda-primary-color)" }}>
                  {displayItem.nickname ?? "Аноним"}
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
        className={`${classes.item} ${displayItem.active ? classes.active : ""}`}
        justify="space-between"
      >
        <Flex wrap justify="space-between">
          {header}
          <Flex gap={6}>
            {displayItem.rouletteResults &&
              displayItem.rouletteResults.length > 0 && (
                <Flex align="center" className={`${classes.goals}`} gap={6}>
                  <ReelIcon />
                  <div
                    className={`${classes.rouletteresult}`}
                    style={{ fontSize: `${settings.reelFontSize.value}px` }}
                  >
                    {displayItem.rouletteResults?.map((result) => result.title)}
                  </div>
                </Flex>
              )}
            {settings.showGoalsProperty.value &&
              displayItem.goals &&
              displayItem.goals.length > 0 && (
                <Flex align="center" className={`${classes.goals}`} gap={6}>
                  <DonationGoalIcon />
                  <div style={{ fontSize: `${settings.goalFontSize.value}px` }}>
                    {displayItem.goals?.map((goal) => goal.goalTitle)}
                  </div>
                </Flex>
              )}
          </Flex>
        </Flex>
        <Description item={displayItem} />
      </Flex>
    );
  },
);

export const HistoryItemComponent = observer(
  ({ groupedItems }: { groupedItems: HistoryItem[] }) => {
    if (groupedItems.length > 1) {
      return <GroupedHistoryItemComponent groupedItems={groupedItems} />;
    } else {
      return <SingleHistoryItemComponent displayItem={groupedItems[0]} />;
    }
  },
);
