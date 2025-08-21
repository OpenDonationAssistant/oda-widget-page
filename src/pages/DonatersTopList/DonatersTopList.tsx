import { CSSProperties, ReactNode, useEffect, useState } from "react";
import "./DonatersTopList.css";
import { Carousel, Flex } from "antd";
import { DonatersTopListWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { AbstractDonatersListStore } from "./DonatersListStore";
import { observer } from "mobx-react-lite";
import { log } from "../../logging";

export const DonatersTopList = observer(
  ({
    settings,
    store,
  }: {
    settings: DonatersTopListWidgetSettings;
    store: AbstractDonatersListStore;
  }) => {
    const [backgroundImage, setBackgroundImage] = useState<CSSProperties>({});
    useEffect(() => {
      settings.backgroundImage.calcCss().then(setBackgroundImage);
    }, [settings.backgroundImage.value]);

    const [headerBackgroundImage, setHeaderBackgroundImage] =
      useState<CSSProperties>({});
    useEffect(() => {
      settings.headerBackgroundImage.calcCss().then(setHeaderBackgroundImage);
    }, [settings.headerBackgroundImage.value]);

    const [listBackgroundImage, setListBackgroundImage] =
      useState<CSSProperties>({});
    useEffect(() => {
      settings.listBackgroundImage.calcCss().then(setListBackgroundImage);
    }, [settings.listBackgroundImage.value]);

    const topsize = settings.topsize;
    const layout = settings.layout;
    const title = settings.title;
    const headerFont = settings.headerFont;
    const messageFont = settings.messageFont;
    const widgetMarginTopAndBottomStyle = settings.boxShadow.requiredHeight;
    const widgetMarginLeftAndRightStyle = settings.boxShadow.requiredWidth;

    let listAlignment = settings.listAlignment;
    let listJustifyContent = "flex-start";
    let listAlignItems = "center";
    if (layout === "horizontal") {
      switch (listAlignment) {
        case "Center":
          listJustifyContent = "space-around";
          break;
        case "Left":
          listJustifyContent = "flex-start";
          break;
        case "Right":
          listJustifyContent = "flex-end";
          break;
        default:
          listJustifyContent = "space-around";
          break;
      }
    }
    if (layout === "vertical") {
      switch (listAlignment) {
        case "Center":
          listAlignItems = "center";
          break;
        case "Left":
          listAlignItems = "flex-start";
          break;
        case "Right":
          listAlignItems = "flex-end";
          break;
        default:
          listAlignItems = "center";
          break;
      }
    }

    let textStyle = messageFont.calcStyle();
    textStyle.maxWidth = "100vw";
    textStyle.width = "50vw";
    textStyle.flex = "1 1 auto";

    let donatersTopStyle = headerFont.calcStyle();
    let headerAlignment = settings.headerAlignment;
    donatersTopStyle.textAlign = headerAlignment;
    donatersTopStyle.flex = "0 0 auto";

    const listBorderStyle = settings.listBorder.calcCss();

    textStyle = { ...textStyle, ...listBorderStyle };

    const hideEmpty = settings.hideEmpty;

    if (hideEmpty && (!store.sortedMap || store.sortedMap.size == 0)) {
      return <></>;
    }

    const carouselSettings = settings.carousel.value;
    const packSize = carouselSettings.enabled
      ? carouselSettings.amount
      : topsize;
    const gap = settings.gap;

    function portion(): ReactNode[] {
      if (!store.list) {
        return [];
      }
      let packs = [];
      for (
        let start = 0;
        start < topsize && start < store.list.length;
        start += packSize
      ) {
        let end = start + packSize;
        if (end > topsize) {
          end = topsize;
        }
        if (end > store.list.length) {
          end = store.list.length;
        }
        const label = store.list.slice(start, end).map((record) => (
          <div
            key={start}
            style={{
              ...settings.itemBorder.calcCss(),
              ...settings.itemPadding.calcCss(),
              ...settings.itemRounding.calcCss(),
              ...settings.itemBoxShadow.calcCss(),
              ...settings.itemBackgroundColor.calcCss(),
              ...settings.itemBackgroundImage.calcCss(), // TODO: fix it
              ...{ lineHeight: "1.5" },
            }}
          >
            <div
              style={messageFont.calcStyle()}
              className={`${messageFont.calcClassName()}`}
            >
              {record.nickname} - {record.amount} RUB
            </div>
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

    return (
      <>
        {headerFont.createFontImport()}
        {messageFont.createFontImport()}
        <Flex
          style={{
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
              }}
            >
              <div
                style={donatersTopStyle}
                className={`donaters-title ${headerFont.calcClassName()}`}
              >
                {title}
              </div>
            </div>
          )}
          <Carousel
            style={textStyle}
            className={messageFont.calcClassName()}
            speed={carouselSettings.speed * 1000}
            autoplaySpeed={carouselSettings.delay * 1000}
            autoplay
            dots={false}
          >
            {portion().map((pack) => (
              <div>
                <Flex
                  vertical={layout === "vertical"}
                  align={listAlignItems}
                  justify={listJustifyContent}
                  className="full-width full-height"
                  style={{
                    ...settings.listBorder.calcCss(),
                    ...settings.listPadding.calcCss(),
                    ...settings.listRounding.calcCss(),
                    ...settings.listBoxShadow.calcCss(),
                    ...settings.listBackgroundColor.calcCss(),
                    ...listBackgroundImage,
                  }}
                >
                  {pack}
                </Flex>
              </div>
            ))}
          </Carousel>
        </Flex>
      </>
    );
  },
);
