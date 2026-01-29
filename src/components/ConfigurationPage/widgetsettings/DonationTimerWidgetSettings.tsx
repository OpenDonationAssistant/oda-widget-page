import { ReactNode } from "react";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import classes from "./AbstractWidgetSettings.module.css";
import { DonationTimer } from "../../../pages/DonationTimer/DonationTimer";
import { DemoHistoryStore } from "../../../pages/History/DemoHistoryStore";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { ElementsWidgetSettings } from "../../Element/ElementsWidgetSettings";

export class DonationTimerWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super();
    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new BooleanProperty({
          name: "resetOnLoad",
          value: false,
          displayName: "widget-donation-timer-refresh",
        }),
      ],
    });
  }

  public get resetOnLoad(): boolean {
    const resetOnLoad =
      this.get("resetOnLoad") ??
      new BooleanProperty({
        name: "resetOnLoad",
        value: true,
        displayName: "widget-donation-timer-refresh",
      });
    return resetOnLoad.value;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Таймер донатов"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Считает время с момента последнего доната, обновляется автоматически
          реал-тайм.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Таймер донатов) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public demo() {
    return <DonationTimer settings={this} store={new DemoHistoryStore()} />;
  }
}
