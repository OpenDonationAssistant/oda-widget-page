import { ReactNode } from "react";
import classes from "../AbstractWidgetSettings.module.css";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";
import { ElementsWidgetSettings } from "../../../Element/ElementsWidgetSettings";

export class CanvasWidgetSettings extends ElementsWidgetSettings {
  constructor() {
    super([]);
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Canvas"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Виджет для группировки других виджетов внутри себя.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Canvas) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }
}
