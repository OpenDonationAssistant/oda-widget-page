import { ReactNode } from "react";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { BorderProperty } from "../widgetproperties/BorderProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { RoundingProperty } from "../widgetproperties/RoundingProperty";
import { BoxShadowProperty } from "../widgetproperties/BoxShadowProperty";
import PlayerPopup from "../../PlayerPopup/PlayerPopup";
import { DemoPlayerStore } from "../../PlayerPopup/DemoPlayer";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { Flex } from "antd";

export class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "style",
      title: "Стиль",
      properties: [
        new BorderProperty({
          name: "widgetBorder",
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
    });

    this.addSection({
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
    });
  }

  public get widgetBorderProperty() {
    return (
      (this.get("widgetBorder") as BorderProperty) ||
      new BorderProperty({
        name: "widgetBorder",
      })
    );
  }

  public get roundingProperty() {
    return (
      (this.get("rounding") as RoundingProperty) ||
      new BorderProperty({
        name: "rounding",
      })
    );
  }

  public get audioOnlyProperty() {
    return (
      (this.get("audioOnly") as BooleanProperty) ||
      new BooleanProperty({
        name: "audioOnly",
        value: false,
        displayName: "widget-player-popup-sound-only",
      })
    );
  }

  public get shadowProperty() {
    return (
      (this.get("boxShadow") as BoxShadowProperty) ||
      new BoxShadowProperty({
        name: "boxShadow",
      })
    );
  }

  public hasDemo() {
    return true;
  }

  public demo() {
    return <PlayerPopup player={new DemoPlayerStore()} settings={this} />;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>
            Виджет "Видео из проигрывателя"
          </h3>
          <CloseOverlayButton />
        </Flex>
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
