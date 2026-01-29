import { ReactNode } from "react";
import classes from "./RouletteWidgetSettings.module.css";
import { RouletteItemsProperty } from "./RoutetteItemsProperty";
import { DemoReelStore, ReelStoreContext } from "../../stores/ReelStore";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { ElementsWidget } from "../../components/Element/ElementsWidget";
import { ElementsWidgetSettings } from "../../components/Element/ElementsWidgetSettings";

export class RouletteWidgetSettings extends ElementsWidgetSettings {
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

  public get itemsProperty(): RouletteItemsProperty {
    return this.get("roulette-items") as RouletteItemsProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Рулетка"</h3>
        <div className={`${classes.helpdescription}`}></div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
            <li>Добавить видео в плеер, проверить что виджет отображается.</li>
          </ul>
        </div>
      </>
    );
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
