import { ReactNode } from "react";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "./RouletteWidgetSettings.module.css";
import { RouletteItemsProperty } from "./RoutetteItemsProperty";
import { DemoReelStore, ReelStoreContext } from "../../stores/ReelStore";
import { log } from "../../logging";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { ElementsProperty } from "../../components/Element/ElementsProperty";
import { ElementsWidget } from "../../components/Element/ElementsWidget";

export class RouletteWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
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
        },
      ],
    });

    super.addElementsTab();
  }

  public get elements() {
    return (
      (this.get("elements") ??
        new ElementsProperty({ value: [], available: [] })) as ElementsProperty
    ).elements;
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

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    log.debug("rendering widget settings window");

    return (
      <ReelStoreContext.Provider
        value={new DemoReelStore(20000, this.itemsProperty.value)}
      >
        <ElementsWidget settings={this} />
      </ReelStoreContext.Provider>
    );
  }
}
