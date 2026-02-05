import { ReactNode } from "react";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import {
  SELECTION_TYPE,
  SingleChoiceProperty,
} from "../../components/ConfigurationPage/widgetproperties/SingleChoiceProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { ElementsWidgetSettings } from "../../components/Element/ElementsWidgetSettings";

export class DonatersTopListWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super([
      {
        key: "content",
        title: "tab-donaters-list-content",
        properties: [
          new SingleChoiceProperty({
            name: "type",
            value: "Top",
            displayName: "widget-donaterslist-widget-type",
            options: ["Top", "Last"],
            selectionType: SELECTION_TYPE.SEGMENTED,
          }),
          new SingleChoiceProperty({
            name: "period",
            value: "month",
            displayName: "widget-donaterslist-period",
            options: ["month", "day"],
            selectionType: SELECTION_TYPE.SEGMENTED,
          }),
          new NumberProperty({
            name: "topsize",
            value: 3,
            displayName: "widget-donaterslist-donaters-amount",
          }),
          new BooleanProperty({
            name: "hideEmpty",
            value: false,
            displayName: "widget-donaterslist-hide-empty",
          }),
        ],
      },
    ]);
  }

  public get type(): "Top" | "Last" {
    return this.get("type")?.value;
  }

  public get period(): "month" | "day" {
    return this.get("period")?.value;
  }

  public get topsize(): number {
    return this.get("topsize")?.value;
  }

  public get hideEmpty(): boolean {
    return this.get("hideEmpty")?.value;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Список донатеров"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Отображает информацию про донатеров - топ за выбранный период (день,
          месяц) или последние
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
