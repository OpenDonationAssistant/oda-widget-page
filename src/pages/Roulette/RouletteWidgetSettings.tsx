import { ReactNode } from "react";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "./RouletteWidgetSettings.module.css";

export class RouletteWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: []
    });
  }

  public help(): ReactNode {
    return (
      <>
        <h3 className={`${classes.helptitle}`}>Виджет "Текущий трек"</h3>
        <div className={`${classes.helpdescription}`}>
          Отображает название текущего видео в плеере, кто заказал и сколько
          треков в очереди.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Текущий трек) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
            <li>
              Добавить видео в плеер, проверить что виджет отображается.
            </li>
          </ul>
        </div>
      </>
    );
  }
}

