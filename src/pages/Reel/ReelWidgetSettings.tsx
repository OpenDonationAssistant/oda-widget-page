import { ReactNode, useContext } from "react";
import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import {
  ColorProperty,
  ColorPropertyTarget,
} from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { ReelItemBackgroundProperty } from "../../components/ConfigurationPage/widgetproperties/ReelItemBackgroundProperty";
import { ReelItemListProperty } from "../../components/ConfigurationPage/widgetproperties/ReelItemListProperty";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import SubActionButton from "../../components/SubActionButton/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import { publish } from "../../socket";
import { getRndInteger } from "../../utils";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { ReelWidget } from "./ReelWidget";
import { DemoReelStore } from "../../stores/ReelStore";
import { ReelWinningEffectProperty } from "./ReelWinningEffectProperty";
import { log } from "../../logging";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";

export class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "tab-reel-general",
          properties: [
            new NumberProperty({
              name: "requiredAmount",
              value: 100,
              addon: "₽",
              displayName: "widget-reel-required-amount",
            }),
            new AnimatedFontProperty({
              name: "titleFont",
            }),
            new BorderProperty({
              name: "widgetBorder",
            }),
            new BorderProperty({
              name: "cardBorder",
            }),
            new ColorProperty({
              name: "selectionColor",
              displayName: "widget-reel-background-color",
              target: ColorPropertyTarget.BACKGROUND,
            }),
            new ReelWinningEffectProperty(),
            new NumberProperty({
              name: "perView",
              value: 5,
              addon: "карт", // TODO: localize
              displayName: "widget-reel-displayed-amount",
            }),
            new NumberProperty({
              name: "speed",
              value: 250,
              addon: "ms",
              displayName: "widget-reel-turning-time",
            }),
            new NumberProperty({
              name: "time",
              value: 10,
              addon: "sec",
              displayName: "widget-reel-waiting-time",
            }),
          ],
        },
        {
          key: "prizes",
          title: "tab-reel-prizes",
          properties: [
            new ReelItemListProperty(),
            new ReelItemBackgroundProperty(),
          ],
        },
      ],
    });
  }

  public get titleFontProperty() {
    return this.get("titleFont") as AnimatedFontProperty;
  }
  public get widgetBorderProperty() {
    return this.get("widgetBorder") as BorderProperty;
  }

  public get cardBorderProperty() {
    return this.get("cardBorder") as BorderProperty;
  }

  public get selectionColorProperty() {
    return this.get("selectionColor") as ColorProperty;
  }

  public get perViewProperty() {
    return this.get("perView") as NumberProperty;
  }

  public get speedProperty() {
    return this.get("speed") as NumberProperty;
  }

  public get timeProperty() {
    return this.get("time") as NumberProperty;
  }

  public get optionListProperty() {
    return this.get("optionList") as ReelItemListProperty;
  }

  public get reelWinningEffectProperty() {
    log.debug({ settings: this }, "searching reelWinningEffectProperty");
    return this.get("reelWinningEffect") as ReelWinningEffectProperty;
  }

  public get itemBackgroundProperty() {
    return this.get("backgroundImage") as ReelItemBackgroundProperty;
  }

  runReel(id: string, conf: any) {
    const optionList = this.optionListProperty.value;
    const choosenIndex = getRndInteger(0, optionList.length - 1);
    publish(conf.topic.reel, {
      type: "trigger",
      selection: optionList[choosenIndex],
      widgetId: id,
    });
  }

  Subactions = () => {
    const { conf } = useLoaderData() as WidgetData;
    const { t } = useTranslation();
    const widgetSettingsContext = useContext(WidgetSettingsContext);

    return (
      <SubActionButton
        onClick={() => this.runReel(widgetSettingsContext.widgetId, conf)}
      >
        <div style={{ marginLeft: "2px" }}>{t("button-spin")}</div>
      </SubActionButton>
    );
  };

  public subactions(): ReactNode {
    return <this.Subactions />;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Рулетка"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Позволяет запускать рулетку на донаты, в которой выграет одна из
          карточек - "призов". Запускается на каждый донат больше заданной
          суммы.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              Задать сумму для запуска рулетки в строке 'Требуемая сумма'.
            </li>
            <li>Добавить карточки-призы во вкладке Призы.</li>
            <li>
              В меню этого виджета (Рулетка) скопировать ссылку и вставить
              ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    return (
      <ReelWidget
        settings={this}
        store={
          new DemoReelStore(
            20000,
            this.optionListProperty.value.map((name) => {
              return { id: name, name: name, weight: 1 };
            }),
          )
        }
      />
    );
  }
}
