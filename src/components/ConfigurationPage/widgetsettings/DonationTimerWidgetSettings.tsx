import { ReactNode } from "react";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { DonationTimer } from "../../../pages/DonationTimer/DonationTimer";
import { DemoHistoryStore } from "../../../pages/History/DemoHistoryStore";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { ElementsProperty } from "../../Element/ElementsProperty";

const DEFAULT_ELEMENTS = [
  {
    id: "019b52ec-a1e2-7ed8-b85d-7a821329ddef",
    name: "Надпись",
    type: "label",
    enabled: true,
    level: 0,
    advanced: false,
    advancedLevel: 0,
    order: 0,
    settings: {
      font: {
        family: "mulish",
        size: 36,
        color: {
          angle: 0,
          colors: [
            {
              color: "rgb(255, 255, 255)",
            },
          ],
          gradient: false,
          repeating: false,
          gradientType: 0,
        },
        outline: {
          color: "#000000",
          width: 0,
          enabled: false,
        },
        weight: true,
        italic: false,
        underline: false,
        shadows: [],
        animation: "none",
        animationType: "entire",
        animationSpeed: "slow",
      },
      align: "center",
      value: "Без поддержки уже <time>",
      width: {
        type: "max",
        value: 100,
      },
      border: {
        top: {
          type: "solid",
          color: "rgb(190, 200, 248)",
          width: 3,
        },
        left: {
          type: "solid",
          color: "rgb(190, 200, 248)",
          width: 3,
        },
        right: {
          type: "solid",
          color: "rgb(190, 200, 248)",
          width: 3,
        },
        bottom: {
          type: "solid",
          color: "rgb(190, 200, 248)",
          width: 3,
        },
        isSame: true,
      },
      height: {
        type: "min",
        value: 100,
      },
      shadow: {
        shadows: [],
      },
      justify: "center",
      padding: {
        top: 18,
        left: 18,
        right: 18,
        bottom: 18,
        isSame: true,
      },
      rounding: {
        isSame: true,
        topLeft: 18,
        topRight: 18,
        bottomLeft: 18,
        bottomRight: 18,
      },
      animation: {
        duration: 0,
        animation: "none",
      },
      backgroundColor: {
        angle: 0,
        colors: [
          {
            color: "rgb(22, 22, 24)",
          },
        ],
        gradient: false,
        repeating: false,
        gradientType: 0,
      },
      backgroundImage: {
        url: null,
        name: null,
        size: "auto",
        repeat: false,
        opacity: 1,
      },
    },
    containerId: null,
  },
];

export class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [
        new BooleanProperty({
          name: "resetOnLoad",
          value: true,
          displayName: "widget-donation-timer-refresh",
        }),
      ],
    });

    this.addSection({
      key: "elements",
      title: "Отображение",
      properties: [
        new ElementsProperty({
          value: DEFAULT_ELEMENTS,
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

  public get elements() {
    return (
      (this.get("elements") ??
        new ElementsProperty({ value: [] })) as ElementsProperty
    ).elements;
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

  public hasDemo() {
    return true;
  }

  public demo() {
    return <DonationTimer settings={this} store={new DemoHistoryStore()} />;
  }
}
