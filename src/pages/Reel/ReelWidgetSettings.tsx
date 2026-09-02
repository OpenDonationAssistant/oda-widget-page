import { ReactNode, useContext } from "react";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import SubActionButton from "../../components/Button/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import { publish } from "../../socket";
import { getRndInteger } from "../../utils";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import { DemoReelStore, ReelStoreContext } from "../../stores/ReelStore";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { ElementsWidget } from "../../components/Element/ElementsWidget";
import { RouletteItemsProperty } from "../Roulette/RoutetteItemsProperty";
import { ElementsWidgetSettings } from "../../components/Element/ElementsWidgetSettings";

export class ReelWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super();
    super.addSection({
      key: "items",
      title: "Лоты",
      properties: [
        new NumberProperty({
          name: "requiredAmount",
          value: 100,
          addon: "₽",
          displayName: "widget-reel-required-amount",
        }),
        new RouletteItemsProperty(),
      ],
    });
  }

  runReel(id: string, conf: any) {
    const optionList = this.itemsProperty.value;
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

  public get itemsProperty(): RouletteItemsProperty {
    return this.get("roulette-items") as RouletteItemsProperty;
  }

  public demo(): ReactNode {
    return (
      <ReelStoreContext.Provider
        value={new DemoReelStore(20000, this.itemsProperty.value)}
      >
        <ElementsWidget settings={this} />
      </ReelStoreContext.Provider>
    );
  }
}
