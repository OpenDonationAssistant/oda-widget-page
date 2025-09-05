import { ReactNode } from "react";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { Flex } from "antd";

export class PlayerControlWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Remote Control"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Позволяет удаленно управлять виджетом Плеер - добавлять треки,
          паузить/включать плеер.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (События) скопировать ссылку.</li>
            <li>Открыть ссылку в браузере</li>
          </ul>
        </div>
      </>
    );
  }
}
