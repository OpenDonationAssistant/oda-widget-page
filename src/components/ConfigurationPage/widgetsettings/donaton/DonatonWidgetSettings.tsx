import { ReactNode } from "react";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import classes from "../AbstractWidgetSettings.module.css";
import { DateTimeProperty } from "../../widgetproperties/DateTimeProperty";
import { DonatonPriceProperty } from "./DonatonPriceProperty";
import { DonatonWidget } from "../../../../pages/Donaton/DonatonWidget";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";
import { ElementsProperty } from "../../../Element/ElementsProperty";

const DEFAULT_ELEMENTS = [{
  id: "019b5738-35e2-7583-afe3-6b44d4158d92",
  name: "Надпись",
  type: "label",
  enabled: true,
  level: 0,
  advanced: false,
  advancedLevel: 0,
  order: 0,
  settings: {
    font: {
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
      family: "mulish",
      italic: false,
      weight: true,
      outline: {
        color: "#000000",
        width: 0,
        enabled: false,
      },
      shadows: [],
      animation: "none",
      underline: false,
      animationType: "entire",
      animationSpeed: "slow",
    },
    align: "center",
    value: "Осталось еще <time>",
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
}];

const defaultTimerEndProperty = () =>
  new DateTimeProperty({
    name: "timer-end",
    displayName: "widget-donaton-timer-end",
    help: "Время, до которого будет отсчитывать таймер. Подразумевается, что это время окончания стрима. В любой момент можно выставить новое время, таймер обновится.",
  });

export class DonatonWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "general",
      title: "Общие",
      properties: [new DonatonPriceProperty(), defaultTimerEndProperty()],
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

  public get timerEndProperty(): DateTimeProperty {
    return (
      (this.get("timer-end") as DateTimeProperty) ?? defaultTimerEndProperty()
    );
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
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Донатон"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Запускает обратный отсчет до конца стрима. Таймер увеличивается в
          зависимости от суммы доната.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Донатон) скопировать ссылку.</li>
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
    return <DonatonWidget settings={this} />;
  }
}
