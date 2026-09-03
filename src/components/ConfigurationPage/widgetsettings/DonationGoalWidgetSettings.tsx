import { DonationGoalProperty } from "../widgetproperties/DonationGoalProperty";

import classes from "./AbstractWidgetSettings.module.css";
import { ReactNode } from "react";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { VariableDescription } from "../../../stores/VariableStore";
import { DonationGoal } from "../../../pages/DonationGoal/DonationGoal";
import { ElementsWidgetSettings } from "../../Element/ElementsWidgetSettings";

export class DonationGoalWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super([
      {
        key: "goals",
        title: "tab-donationgoal-goals",
        properties: [new DonationGoalProperty()],
      },
    ]);
  }

  public copy(): DonationGoalWidgetSettings {
    const settings = new DonationGoalWidgetSettings();
    settings.sections = this.sections.map((section) => {
      return {
        key: section.key,
        title: section.title,
        properties: section.properties.map((it) => it.copy()),
      };
    });
    return settings;
  }

  protected get variables(): VariableDescription[] {
    return [
      {
        name: "items",
        description: "Список целей",
        type: "matrix",
        nested: [
          {
            name: "name",
            description: "Название цели",
            type: "string",
          },
          {
            name: "description",
            description: "Описание цели",
            type: "string",
          },
          {
            name: "collected",
            description: "Собранная сумма",
            type: "number",
          },
          {
            name: "required",
            description: "Требуемая сумма сумма",
            type: "number",
          },
          {
            name: "proportion",
            description: "Соотношение собранная/требуемая",
            type: "number",
          },
          {
            name: "currency",
            description: "Валюта",
            type: "string",
          },
        ],
      },
    ];
  }

  // <DonationGoal settings={this} state={new DemoDonationGoalState(this)} />
  public demo() {
    return (
      <Flex className="full-width" vertical justify="center">
        <DonationGoal settings={this} />
      </Flex>
    );
  }

  public help(): ReactNode {
    return (
      <>
        <Flex justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Сбор средств"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Позволяет создать цели сбора донатов и отслеживать их выполнение на
          стриме.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              В настройках виджета создать цели с помощью кнопки "Добавить
              цели", добавить им название и описание, задать сумму.
            </li>
            <li>
              Чтобы какая-то цель выбиралась автоматически, в панели цели надо
              включить опцию 'По умолчанию'.
            </li>
            <li>
              Чтобы отобразить прогресс на стриме, в меню виджета скопируйте
              ссылку и встатьте ссылку как Browser Source в OBS поверх картинки
              стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public get goalProperty(): DonationGoalProperty {
    return this.get("goal") as DonationGoalProperty;
  }
}
