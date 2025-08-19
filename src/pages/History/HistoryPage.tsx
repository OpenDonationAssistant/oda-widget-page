import { Flex, Spin, Switch } from "antd";
import classes from "./HistoryPage.module.css";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import AddHistoryItemModal from "./AddHistoryItemModal";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Subtitle,
  Title,
} from "../../components/Overlay/Overlay";
import { useContext, useEffect, useRef, useState } from "react";
import { LabeledSwitchComponent } from "../../components/LabeledSwitch/LabeledSwitchComponent";
import { DefaultHistoryStore, HistoryStore, HistoryStoreContext } from "./HistoryStore";
import { observer } from "mobx-react-lite";
import { HistoryItemComponent } from "./HistoryItem";
import CloseIcon from "../../icons/CloseIcon";
import { WidgetStoreContext } from "../../stores/WidgetStore";
import { log } from "../../logging";
import { PremoderationProperty } from "../../components/ConfigurationPage/widgetsettings/alerts/PremoderationProperty";
import { produce } from "immer";
import { toJS } from "mobx";
import ODALogo from "../../components/ODALogo/ODALogo";
import { DefaultNewsStore, NewsStore } from "../../stores/NewsStore";
import Marquee from "react-fast-marquee";

const HistoryItemList = observer(({}: {}) => {
  const lastLoaded = useRef<HTMLDivElement | null>(null);
  const historyStore = useContext(HistoryStoreContext);

  useEffect(() => {
    if (lastLoaded.current) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          historyStore?.next();
        }
      });
      observer.observe(lastLoaded.current);
      return () => observer.disconnect();
    }
  }, [historyStore?.isRefreshing, lastLoaded]);

  return (
    <Flex vertical gap={3}>
      {historyStore?.items.map((item, index) => (
        <>
          {index === 0 && item.date === historyStore?.today && (
            <div className={`${classes.historyday}`}>Сегодня ({item.date})</div>
          )}
          {index === 0 && item.date !== historyStore?.today && (
            <div className={`${classes.historyday}`}>{item.date}</div>
          )}
          {index !== 0 &&
            item.date !== historyStore?.items.at(index - 1)?.date && (
              <div className={`${classes.historyday}`}>{item.date}</div>
            )}
          <div
            key={index}
            ref={
              index === (historyStore?.items.length ?? 0) - 1
                ? lastLoaded
                : null
            }
          >
            <HistoryItemComponent item={item} />
          </div>
        </>
      ))}
      {historyStore?.isRefreshing && <Spin />}
    </Flex>
  );
});

const NewsLineComponent = observer(({}) => {
  const [newsStore] = useState<NewsStore>(() => new DefaultNewsStore());
  return (
    <>
      {newsStore.news && newsStore.news.length > 0 && (
        <Flex className={`${classes.newscontainer}`} align="center">
          <div className={`${classes.newsprefix}`}>new</div>
          <Marquee className={`${classes.newsline}`}>
            {newsStore.news.at(0)?.title}
          </Marquee>
          <NotBorderedIconButton
            onClick={() => {
              window.open("https://oda.digital/news", undefined, "popup=true");
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

export const HistoryComponent = observer(
  ({ showHeader }: { showHeader: boolean }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    const historyStore = useContext(HistoryStoreContext);
    const widgetStore = useContext(WidgetStoreContext);
    const [premoderation, setPremoderation] = useState<boolean>(() => false);

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
              <Flex align="top" justify="space-between">
                <Title>Настройки отображения</Title>
                <NotBorderedIconButton
                  onClick={() => (dialogState.show = false)}
                >
                  <CloseIcon color="white" />
                </NotBorderedIconButton>
              </Flex>
              <Subtitle>
                Выберите, какие события будут отображаться в истории
              </Subtitle>
              <Flex vertical gap={9} className={`${classes.filters}`}>
                <div className={`${classes.filtersection}`}>Донаты</div>
                <div className={`${classes.filterlist}`}>
                  <LabeledSwitchComponent
                    value={historyStore.showODA}
                    label="ODA"
                    onChange={(update) => {
                      historyStore.showODA = update;
                    }}
                  />
                  <LabeledSwitchComponent
                    value={historyStore.showDonationAlerts}
                    label="DonationAlerts"
                    onChange={(update) =>
                      (historyStore.showDonationAlerts = update)
                    }
                  />
                  <LabeledSwitchComponent
                    value={historyStore.showDonatePay}
                    label="DonatePay.ru"
                    onChange={(update) => (historyStore.showDonatePay = update)}
                  />
                  <LabeledSwitchComponent
                    value={historyStore.showDonatePayEu}
                    label="DonatePay.eu"
                    onChange={(update) =>
                      (historyStore.showDonatePayEu = update)
                    }
                  />
                </div>
              </Flex>
            </Panel>
          </Overlay>
          <Flex
            justify="space-between"
            align="center"
            style={
              showHeader ? { marginBottom: "36px" } : { marginBottom: "12px" }
            }
          >
            {showHeader && <h1 className={`${classes.header}`}>История</h1>}
            {!showHeader && <ODALogo />}
            <Flex gap={9}>
              <Flex
                align="center"
                justify="center"
                gap={6}
                className={`${classes.premoderationbutton}`}
              >
                <div>Премодерация</div>
                <Switch
                  value={premoderation}
                  onChange={(update) => {
                    widgetStore
                      .search({ type: "payment-alerts" })
                      .forEach((widget) => {
                        const property = widget.config.get("premoderation") as
                          | PremoderationProperty
                          | undefined;
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
              <AddHistoryItemModal compact={!showHeader} />
              <BorderedIconButton
                onClick={() => {
                  dialogState.show = true;
                }}
              >
                <span
                  className="material-symbols-sharp"
                  style={{ color: "white", fontWeight: 250 }}
                >
                  tune
                </span>
              </BorderedIconButton>
            </Flex>
          </Flex>
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
  const [store] = useState<HistoryStore>(
    () => new DefaultHistoryStore(recipientId, "history-page", conf),
  );

  return (
    <HistoryStoreContext.Provider value={store}>
      <HistoryComponent showHeader={true} />
    </HistoryStoreContext.Provider>
  );
});
