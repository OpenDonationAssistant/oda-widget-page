import { ReactNode } from "react";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { Flex } from "antd";
import classes from "./SocialsWidgetSettings.module.css";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { ElementsProperty } from "../../components/Element/ElementsProperty";
import { SocialsWidget } from "./SocialsWidget";

export class SocialsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "elements",
          title: "elements",
          properties: [
            new ElementsProperty({
              value: [],
            }),
          ],
        },
      ],
    });
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
        <Flex justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Социальные сети"</h3>
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
    return <SocialsWidget settings={this} />;
  }
}
