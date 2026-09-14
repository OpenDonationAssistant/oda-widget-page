import { DatePicker, Flex, Spin, Switch } from "antd";
import classes from "./HistoryPage.module.css";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import dayjs from "dayjs";
import AddHistoryItemModal from "./AddHistoryItemModal";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import {
  CloseOverlayButton,
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Subtitle,
} from "../../components/Overlay/Overlay";
import { useContext, useEffect, useRef, useState } from "react";
import {
  DefaultHistoryStore,
  HistoryItem,
  HistoryStore,
  HistoryStoreContext,
} from "./HistoryStore";
import { observer } from "mobx-react-lite";
import { HistoryItemComponent } from "./HistoryItem";
import CloseIcon from "../../icons/CloseIcon";
import { WidgetStoreContext } from "../../stores/WidgetStore";
import { log } from "../../logging";
import { PremoderationProperty } from "../../components/ConfigurationPage/widgetsettings/alerts/PremoderationProperty";
import { produce } from "immer";
import { toJS } from "mobx";
import ConnectedServices from "../../components/ConnectedServices/ConnectedServices";
import ConnectionErrorsPanel from "../../components/ConnectionErrorsPanel/ConnectionErrorsPanel";
import { DefaultNewsStore, NewsStore } from "../../stores/NewsStore";
import Marquee from "react-fast-marquee";
import SecondaryButton from "../../components/Button/SecondaryButton";
import { useTranslation } from "react-i18next";
import SubActionButton from "../../components/Button/SubActionButton";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import {
  HistoryWidgetSettings,
  HistoryWidgetSettingsContenxt,
} from "./HistoryWidgetSettings";
import { useAuth } from "../../contexts/AuthContext";
import {
  EmoteCacheExport,
  exportEmoteCache,
  importEmoteCache,
} from "../../emoteCacheWorker";

const dateFormat = "DD/MM/YYYY HH:mm";

const GROUPABLE_COMBINATIONS: { event: string; system: string }[] = [
  { event: "follow", system: "Boosty" },
  { event: "follow", system: "Twitch" },
  { event: "follow", system: "Kick" },
  { event: "follow", system: "VKLive" },
  { event: "raid", system: "Twitch" },
  { event: "subscription", system: "Twitch" },
  { event: "subscription", system: "VKLive" },
];

function isGroupable(item: HistoryItem): boolean {
  return GROUPABLE_COMBINATIONS.some(
    (combo) => combo.event === item.event && combo.system === item.system,
  );
}

interface HistoryItemGroup {
  type: "single" | "group";
  items: HistoryItem[];
}

function groupConsecutiveItems(items: HistoryItem[]): HistoryItemGroup[] {
  const groups: HistoryItemGroup[] = [];
  let i = 0;

  while (i < items.length) {
    const currentItem = items[i];

    if (!isGroupable(currentItem)) {
      groups.push({ type: "single", items: [currentItem] });
      i++;
      continue;
    }

    const groupItems: HistoryItem[] = [currentItem];
    let j = i + 1;

    while (j < items.length) {
      const nextItem = items[j];
      if (
        isGroupable(nextItem) &&
        nextItem.event === currentItem.event &&
        nextItem.system === currentItem.system
      ) {
        groupItems.push(nextItem);
        j++;
      } else {
        break;
      }
    }

    groups.push({
      type: groupItems.length > 1 ? "group" : "single",
      items: groupItems,
    });
    i = j;
  }

  return groups;
}

const HistoryItemList = observer(({}: {}) => {
  const historyStore = useContext(HistoryStoreContext);
  const settings = new HistoryWidgetSettings();
  settings.set("showRequests", true);
  settings.set("showGoals", true);

  const groups = groupConsecutiveItems(historyStore?.items ?? []);

  return (
    <HistoryWidgetSettingsContenxt.Provider value={settings}>
      <Flex vertical gap={3}>
        {groups.map((group, groupIndex) => {
          const isFirstItem = groupIndex === 0;
          const firstGroupItem = group.items[0];
          const firstGroupItemDate = firstGroupItem.date;
          const prevGroup = groups[groupIndex - 1];
          const prevGroupFirstItemDate = prevGroup?.items[0]?.date;

          return (
            <div key={`group-${groupIndex}`}>
              {isFirstItem && firstGroupItemDate === historyStore?.today && (
                <div className={`${classes.historyday}`}>
                  Сегодня ({firstGroupItemDate})
                </div>
              )}
              {isFirstItem && firstGroupItemDate !== historyStore?.today && (
                <div className={`${classes.historyday}`}>
                  {firstGroupItemDate}
                </div>
              )}
              {!isFirstItem &&
                firstGroupItemDate !== prevGroupFirstItemDate && (
                  <div className={`${classes.historyday}`}>
                    {firstGroupItemDate}
                  </div>
                )}
              <HistoryItemComponent groupedItems={group.items} />
            </div>
          );
        })}
        {historyStore?.isRefreshing && <Spin />}
        {!historyStore?.isRefreshing && historyStore?.hasNext() && (
          <Flex
            className={`${classes.loadmore}`}
            justify="center"
            align="center"
          >
            <SecondaryButton onClick={() => historyStore?.next()}>
              Показать еще
            </SecondaryButton>
          </Flex>
        )}
      </Flex>
    </HistoryWidgetSettingsContenxt.Provider>
  );
});

const NewsLineComponent = observer(({}) => {
  const { accessToken } = useAuth();
  const [newsStore] = useState<NewsStore>(
    () => new DefaultNewsStore(accessToken ?? ""),
  );
  return (
    <>
      {newsStore.news && newsStore.news.length > 0 && (
        <Flex className={`${classes.newscontainer}`} align="center">
          <div className={`${classes.newsprefix}`}>new</div>
          <Marquee
            className={`${classes.newsline}`}
            style={{ marginRight: "36px" }}
          >
            {newsStore.news.at(newsStore.news.length - 1)?.title}
          </Marquee>
          <NotBorderedIconButton
            onClick={() => {
              window.open("https://oda.digital/news/", undefined, "popup=true");
            }}
          >
            <span className={`material-symbols-sharp ${classes.openicon}`}>
              open_in_new
            </span>
          </NotBorderedIconButton>
          <NotBorderedIconButton onClick={() => newsStore.markAsRead()}>
            <CloseIcon color="var(--oda-color-950)" />
          </NotBorderedIconButton>
        </Flex>
      )}
    </>
  );
});

const SwitchComponent = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (update: any) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Flex justify="space-between" align="center" gap={21}>
      <div className={`${classes.switchlabel}`}>{t(label)}</div>
      <Switch value={value} onChange={onChange} />
    </Flex>
  );
};

export const HistoryComponent = observer(
  ({ showHeader }: { showHeader: boolean }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const { t } = useTranslation();

    const historyStore = useContext(HistoryStoreContext);
    const widgetStore = useContext(WidgetStoreContext);
    const [premoderation, setPremoderation] = useState<boolean>(() => false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const emoteImportInputRef = useRef<HTMLInputElement>(null);

    const handleExportEmotes = async () => {
      try {
        const data = await exportEmoteCache();
        if (!data) return;
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "emote-cache.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        log.error(error, "Failed to export emote cache");
      }
    };

    const handleImportEmotes = async (file: File) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text) as EmoteCacheExport;
        if (!Array.isArray(data.entries)) {
          throw new Error("Invalid emote cache file");
        }
        await importEmoteCache(data);
      } catch (error) {
        log.error(error, "Failed to import emote cache");
      }
    };

    useEffect(() => {
      const alerts = widgetStore.search({ type: "payment-alerts" });
      if (!alerts) {
        setPremoderation(false);
        return;
      }
      log.debug({ alerts: alerts }, "setting premoderation to true as default");
      setPremoderation(true);
      alerts.forEach((alert) => {
        const property = alert.config.get(
          "premoderation",
        ) as PremoderationProperty;
        if (!property) {
          log.debug("set premoderation false because of missing property");
          setPremoderation(false);
          return;
        }
        log.debug(
          { enabled: property.value.enabled },
          "checking value of premoderation property",
        );
        if (!property.value.enabled) {
          log.debug("set premoderation false because of property value");
          setPremoderation(false);
          return;
        }
      });
    }, [widgetStore.list]);

    return historyStore ? (
      <>
        <ModalStateContext.Provider value={dialogState}>
          <Overlay>
            <Panel>
              <Flex justify="space-between" className="full-width">
                <div className={`${classes.title}`}>Настройки отображения</div>
                <CloseOverlayButton />
              </Flex>
              <Subtitle>
                Выберите, какие события будут отображаться в истории
              </Subtitle>
              <div className={`${classes.filters}`}>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>Донаты</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showODA}
                      label="ODA"
                      onChange={(update) => {
                        historyStore.showODA = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showDonationAlerts}
                      label="DonationAlerts"
                      onChange={(update) =>
                        (historyStore.showDonationAlerts = update)
                      }
                    />
                    <SwitchComponent
                      value={historyStore.showDonatePay}
                      label="DonatePay.ru"
                      onChange={(update) =>
                        (historyStore.showDonatePay = update)
                      }
                    />
                    <SwitchComponent
                      value={historyStore.showDonatePayEu}
                      label="DonatePay.eu"
                      onChange={(update) =>
                        (historyStore.showDonatePayEu = update)
                      }
                    />
                    <SwitchComponent
                      value={historyStore.showDonateX}
                      label="DonateX"
                      onChange={(update) => (historyStore.showDonateX = update)}
                    />
                    <SwitchComponent
                      value={historyStore.showTribute}
                      label="Tribute"
                      onChange={(update) => (historyStore.showTribute = update)}
                    />
                  </div>
                </Flex>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>Boosty</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showBoostySubs}
                      label="Подписки Boosty"
                      onChange={(update) => {
                        historyStore.showBoostySubs = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showBoostyFollows}
                      label="Отслеживания Boosty"
                      onChange={(update) => {
                        historyStore.showBoostyFollows = update;
                      }}
                    />
                  </div>
                </Flex>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>Meme Alerts</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showMemeAlertsCoins}
                      label="Покупки Meme Alerts"
                      onChange={(update) => {
                        historyStore.showMemeAlertsCoins = update;
                      }}
                    />
                  </div>
                </Flex>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>Twitch</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showTwitchFollows}
                      label="Подписки (фолловы) Twitch"
                      onChange={(update) => {
                        historyStore.showTwitchFollows = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showTwitchRaids}
                      label="Рейды Twitch"
                      onChange={(update) => {
                        historyStore.showTwitchRaids = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showTwitchCheers}
                      label="Чиры Twitch"
                      onChange={(update) => {
                        historyStore.showTwitchCheers = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showTwitchSubs}
                      label="Подписки Twitch"
                      onChange={(update) => {
                        historyStore.showTwitchSubs = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showTwitchSubGifts}
                      label="Подаренные подписки Twitch"
                      onChange={(update) => {
                        historyStore.showTwitchSubGifts = update;
                      }}
                    />
                  </div>
                </Flex>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>Kick</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showKickFollows}
                      label="Подписки (фолловы) Kick"
                      onChange={(update) => {
                        historyStore.showKickFollows = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showKickGifts}
                      label="Подарки Kick"
                      onChange={(update) => {
                        historyStore.showKickGifts = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showKickSubs}
                      label="Подписки Kick"
                      onChange={(update) => {
                        historyStore.showKickSubs = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showKickSubGifts}
                      label="Подаренные подписки Kick"
                      onChange={(update) => {
                        historyStore.showKickSubGifts = update;
                      }}
                    />
                  </div>
                </Flex>
                <Flex className={`${classes.filterpanel}`} vertical>
                  <div className={`${classes.filtersection}`}>VK Live</div>
                  <div className={`${classes.filterlist}`}>
                    <SwitchComponent
                      value={historyStore.showVKLiveFollows}
                      label="Подписки (фолловы) VK Live"
                      onChange={(update) => {
                        historyStore.showVKLiveFollows = update;
                      }}
                    />
                    <SwitchComponent
                      value={historyStore.showVKLiveSubs}
                      label="Подписки VK Live"
                      onChange={(update) => {
                        historyStore.showVKLiveSubs = update;
                      }}
                    />
                  </div>
                </Flex>
              </div>
            </Panel>
          </Overlay>
          <Flex justify="space-between" align="center" gap={12} wrap>
            {showHeader && <h1 className={`${classes.header}`}>История</h1>}
            {!showHeader && <ConnectedServices />}
            <Flex gap={3} className={`${classes.headerbuttons}`}>
              {!showHeader &&
                widgetStore.search({
                  type: "chat",
                }).length > 0 && (
                  <>
                    <BorderedIconButton onClick={handleExportEmotes}>
                      <span
                        className={`material-symbols-sharp ${classes.iconbutton}`}
                      >
                        archive
                      </span>
                    </BorderedIconButton>
                    <input
                      ref={emoteImportInputRef}
                      type="file"
                      accept="application/json"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          handleImportEmotes(file);
                        }
                        event.target.value = "";
                      }}
                    />
                    <BorderedIconButton
                      onClick={() => emoteImportInputRef.current?.click()}
                    >
                      <span
                        className={`material-symbols-sharp ${classes.iconbutton}`}
                      >
                        restore_from_trash
                      </span>
                    </BorderedIconButton>
                  </>
                )}
              {!showHeader &&
                widgetStore.list.filter(
                  (widget) => widget.type === "payment-alerts",
                ).length > 0 && (
                  <Flex
                    align="center"
                    justify="center"
                    gap={6}
                    className={`${classes.premoderationbutton}`}
                  >
                    <Flex align="center">
                      <span
                        className={`material-symbols-sharp ${classes.iconbutton}`}
                      >
                        local_police
                      </span>
                      <div className={`${classes.moderationlabel}`}>
                        Премодерация
                      </div>
                    </Flex>
                    <Switch
                      value={premoderation}
                      onChange={(update) => {
                        widgetStore
                          .search({ type: "payment-alerts" })
                          .forEach((widget) => {
                            const property = widget.config.get(
                              "premoderation",
                            ) as PremoderationProperty | undefined;
                            if (!property) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.enabled = update;
                              },
                            );
                            widget.save().then(() => setPremoderation(update));
                          });
                      }}
                    />
                  </Flex>
                )}
              {showHeader && (
                <SubActionButton
                  onClick={() => setShowFilters((old) => !old)}
                  icon={
                    <span className={`material-symbols-sharp`}>search</span>
                  }
                >
                  {t("button-find")}
                </SubActionButton>
              )}
              <AddHistoryItemModal compact={!showHeader} />
              {showHeader && (
                <SubActionButton
                  onClick={() => {
                    historyStore.export();
                  }}
                  icon={
                    <span className={`material-symbols-sharp`}>download</span>
                  }
                >
                  {t("button-export")}
                </SubActionButton>
              )}
              <BorderedIconButton
                onClick={() => {
                  dialogState.show = true;
                }}
              >
                <span
                  className={`material-symbols-sharp ${classes.iconbutton}`}
                >
                  tune
                </span>
              </BorderedIconButton>
            </Flex>
          </Flex>
          {showFilters && (
            <Flex vertical gap={9} className={`${classes.searchfilters}`}>
              <LabeledContainer displayName="Дата">
                <Flex
                  gap={18}
                  align="center"
                  className={`${classes.searchline}`}
                >
                  <DatePicker
                    value={
                      historyStore.after ? dayjs(historyStore.after) : null
                    }
                    className="full-width"
                    showTime
                    format={dateFormat}
                    onChange={(value) => {
                      historyStore.after = value?.toDate();
                    }}
                  />
                  <div> - </div>
                  <DatePicker
                    value={
                      historyStore.before ? dayjs(historyStore.before) : null
                    }
                    className="full-width"
                    showTime
                    format={dateFormat}
                    onChange={(value) => {
                      historyStore.before = value?.toDate();
                    }}
                  />
                </Flex>
              </LabeledContainer>
            </Flex>
          )}
          {!showHeader && <ConnectionErrorsPanel />}
          {!showHeader && <NewsLineComponent />}
          <HistoryItemList />
        </ModalStateContext.Provider>
      </>
    ) : (
      <></>
    );
  },
);

export const HistoryPage = observer(({}) => {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const token = localStorage.getItem("access-token");
  if (!token) {
    throw new Error("No token");
  }
  const [store] = useState<HistoryStore>(
    () => new DefaultHistoryStore(token, recipientId, `history-page`, conf),
  );

  return (
    <HistoryStoreContext.Provider value={store}>
      <HistoryComponent showHeader={true} />
    </HistoryStoreContext.Provider>
  );
});
