import { ReactNode } from "react";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { BoxShadowProperty } from "../widgetproperties/BoxShadowProperty";

export class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new BooleanProperty({
              name: "audioOnly",
              value: false,
              displayName: "widget-player-popup-sound-only",
              help: "С включенной опцией 'Только звук' видео показываться не будет. Такая опция по сути позволяет захватить в OBS отдельно аудио из плеера - если вы добавляете плеер в OBS как Dock, то для него не создается отдельной аудиодорожки. Добавив этот виджет на сцену и включив эту опцию, вы по сути просто создадите отдельную аудиодорожку для плеера.",
            }),
          ],
        },
        {
          key: "style",
          title: "Стиль",
          properties: [
            new BorderProperty({
              name: "widgetBorder",
              displayName: "widget-player-popup-border",
              help: "Позволяет создать рамку вокруг виджета, задать ее цвет и толщину. Значение 'Общая' задает рамку с одинаковыми сторонами, 'Стороны' позволяет менять цвет, толщину или стиль рамки на конкретной стороне (справа, слева, снизу, сверху).",
            }),
            new RoundingProperty({
              name: "rounding",
              displayName: "rounding",
              help: "Устанавливает скругление углов виджета вокруг содержимого.",
            }),
            new BoxShadowProperty({
              name: "boxShadow",
              displayName: "Тени виджета",
              help: "Устанавливает тени виджета.",
            }),
          ],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>
          Виджет "Видео из проигрывателя"
        </h3>
        <div className={`${classes.helpdescription}`}>
          Показывает на стриме видео из реквеста.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>Подключить виджет "Проигрыватель видео"(плеер)</li>
            <li>
              В меню этого виджета (Видео из проигрывателя) скопировать ссылку и
              вставить как Browser Source поверх картинки стрима
            </li>
            <li>Дождаться реквеста или добавить видео в плеер</li>
            <li>В плеере нажать переключатель Embedded</li>
            <li>
              В этом виджете поверх стрима должен начать проигрываться реквест
            </li>
          </ul>
        </div>
      </>
    );
  }
}
