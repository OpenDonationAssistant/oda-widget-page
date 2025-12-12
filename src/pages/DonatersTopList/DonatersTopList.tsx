import { CSSProperties, ReactNode, useEffect, useState } from "react";
import "./DonatersTopList.css";
import { Flex } from "antd";
import { DonatersTopListWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { AbstractDonatersListStore } from "./DonatersListStore";
import { observer } from "mobx-react-lite";
import { log } from "../../logging";
import { SlideShowComponent } from "../../components/SlideShow/SlideShowComponent";
import { HistoryStore } from "../History/HistoryStore";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

export const DonatersTopList = observer(
  ({
    settings,
    topListStore,
    historyStore,
  }: {
    settings: DonatersTopListWidgetSettings;
    topListStore: AbstractDonatersListStore;
    historyStore: HistoryStore;
  }) => {
    // TODO возможно надо посмотреть более прямой и очевидный способ их синкать
    useEffect(() => {
      log.debug(
        {
          type: settings.type,
          topsize: settings.topsize,
        },
        "toplist settings changed",
      );
      if (settings.type === "Last") {
        historyStore.loadUntil(settings.topsize);
      }
    }, [settings.topsize, settings.type, historyStore]);

    const topsize = settings.topsize;
    const now = new Date();
    const dayDateDiff =
      settings.period === "day"
        ? 1000 * 60 * 60 * 24
        : 1000 * 60 * 60 * 24 * 30;
    const recordsList =
      settings.type === "Top"
        ? topListStore.list
        : historyStore.items
            .filter((item) => {
              return now.getTime() - item.timestamp.getTime() < dayDateDiff;
            })
            .map((item) => {
              return {
                nickname: item.nickname,
                amount: item.amount.major,
              };
            });

    const [backgroundImage, setBackgroundImage] = useState<CSSProperties>({});
    useEffect(() => {
      settings.backgroundImage.calcCss().then(setBackgroundImage);
    }, [settings.backgroundImage, settings.backgroundImage.value]);

    const [headerBackgroundImage, setHeaderBackgroundImage] =
      useState<CSSProperties>({});
    useEffect(() => {
      settings.headerBackgroundImage.calcCss().then(setHeaderBackgroundImage);
    }, [settings.headerBackgroundImage, settings.headerBackgroundImage.value]);

    const [listBackgroundImage, setListBackgroundImage] =
      useState<CSSProperties>({});
    useEffect(() => {
      settings.listBackgroundImage.calcCss().then(setListBackgroundImage);
    }, [settings.listBackgroundImage, settings.listBackgroundImage.value]);

    const [itemBackgroundImage, setItemBackgroundImage] =
      useState<CSSProperties>({});
    useEffect(() => {
      settings.itemBackgroundImage.calcCss().then(setItemBackgroundImage);
    }, [settings.itemBackgroundImage, settings.itemBackgroundImage.value]);

    const layout = settings.layout;
    const title = settings.title;
    const widgetMarginTopAndBottomStyle = settings.boxShadow.requiredHeight;
    const widgetMarginLeftAndRightStyle = settings.boxShadow.requiredWidth;

    let listJustifyContent = "flex-start";
    let listAlignItems = "center"; // TODO Use AlignmentRenderer
    switch (settings.listAlignment) {
      case "left":
        listAlignItems = "flex-start";
        break;
      case "right":
        listAlignItems = "flex-end";
        break;
      default:
        listAlignItems = "center";
        break;
    }

    const carouselSettings = settings.carousel.value;
    const packSize = carouselSettings.enabled
      ? carouselSettings.amount
      : topsize;
    const gap = settings.gap;

    function portion(): ReactNode[] {
      let packs = [];
      for (
        let start = 0;
        start < topsize && start < recordsList.length;
        start += packSize
      ) {
        let end = start + packSize;
        if (end > topsize) {
          end = topsize;
        }
        if (end > recordsList.length) {
          end = recordsList.length;
        }
        const label = recordsList.slice(start, end).map((record) => (
          <div
            key={start}
            style={{
              ...settings.itemBorder.calcCss(),
              ...settings.itemPadding.calcCss(),
              ...settings.itemRounding.calcCss(),
              ...settings.itemBoxShadow.calcCss(),
              ...settings.itemBackgroundColor.calcCss(),
              ...itemBackgroundImage,
              // TODO flex-grow 1
              ...{ width: "100%" },
              ...{ height: "100%" },
              ...settings.itemWidth.calcCss(),
              ...settings.itemHeight.calcCss(),
              ...{ alignSelf: "stretch" },
              ...{ display: "flex", justifyContent: listAlignItems },
            }}
          >
            <TextRenderer
              text={`${record.nickname} - ${record.amount} RUB`}
              font={settings.messageFont}
            />
          </div>
        ));
        packs[packs.length] = label;
      }
      log.debug({ packs: packs }, "calculated packs");
      return packs;
    }

    const widgetHeight = settings.heightProperty.value
      ? { height: `${settings.heightProperty.value}px` }
      : { height: `calc(100% - ${widgetMarginTopAndBottomStyle * 2}px)` };

    const widgetWidth = settings.widthProperty.value
      ? { width: `${settings.widthProperty.value}px` }
      : { width: `calc(100% - ${widgetMarginLeftAndRightStyle * 2}px)` };

    if (settings.hideEmpty && (!recordsList || recordsList.length === 0)) {
      return <></>;
    }

    return (
      <Flex
        style={{
          ...{ maxWidth: "calc(min(100vw, 100%))" },
          ...settings.backgroundColor.calcCss(),
          ...settings.widgetBorder.calcCss(),
          ...settings.rounding.calcCss(),
          ...settings.padding.calcCss(),
          ...settings.boxShadow.calcCss(),
          ...backgroundImage,
          ...{
            marginTop: `${widgetMarginTopAndBottomStyle}px`,
            marginBottom: `${widgetMarginTopAndBottomStyle}px`,
            marginLeft: `${widgetMarginLeftAndRightStyle}px`,
            marginRight: `${widgetMarginLeftAndRightStyle}px`,
          },
          ...widgetHeight,
          ...widgetWidth,
        }}
        gap={gap}
        align={layout === "vertical" ? "stretch" : "center"}
        vertical={layout === "vertical"}
      >
        {settings.showHeader && (
          <div
            style={{
              ...settings.titleBackgroundColor.calcCss(),
              ...settings.headerBorder.calcCss(),
              ...settings.headerRounding.calcCss(),
              ...settings.headerPadding.calcCss(),
              ...settings.headerBoxShadow.calcCss(),
              ...headerBackgroundImage,
              ...settings.headerWidth.calcCss(),
              ...settings.headerHeight.calcCss(),
              ...{ textAlign: settings.headerAlignment },
            }}
          >
            <TextRenderer text={title} font={settings.headerFont} />
          </div>
        )}
        {settings.carousel.value.enabled && (
          <Flex
            vertical={layout === "vertical"}
            style={{
              ...{ flex: "1 1 auto" },
              ...settings.listWidth.calcCss(),
              ...settings.listHeight.calcCss(),
              ...settings.listBorder.calcCss(),
              ...settings.listBackgroundColor.calcCss(),
              ...listBackgroundImage,
              ...settings.listRounding.calcCss(),
              ...settings.listPadding.calcCss(),
              ...settings.listBoxShadow.calcCss(),
            }}
          >
            <SlideShowComponent
              slides={portion()}
              period={settings.carousel.value.delay * 1000}
              inAnimation={{
                type: settings.carousel.value.inAnimation,
              }}
              outAnimation={{
                type: settings.carousel.value.outAnimation,
              }}
            />
          </Flex>
        )}
        {!settings.carousel.value.enabled && (
          <Flex
            vertical={layout === "vertical"}
            style={{
              ...{ flex: "1 1 auto" },
              ...settings.listWidth.calcCss(),
              ...settings.listHeight.calcCss(),
              ...settings.listBorder.calcCss(),
              ...settings.listBackgroundColor.calcCss(),
              ...listBackgroundImage,
              ...settings.listRounding.calcCss(),
              ...settings.listPadding.calcCss(),
              ...settings.listBoxShadow.calcCss(),
            }}
          >
            {portion().map((item, index) => (
              <Flex
                key={index}
                vertical={layout === "vertical"}
                justify={listJustifyContent}
                className="full-width"
              >
                {item}
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    );
  },
);
