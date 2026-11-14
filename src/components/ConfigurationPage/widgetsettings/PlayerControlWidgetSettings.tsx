import { ReactNode } from "react";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { Flex } from "antd";
import { Trans } from "react-i18next";

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
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="player-control-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="player-control-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-howto-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="player-control-help-step1" />
            </li>
            <li>
              <Trans i18nKey="player-control-help-step2" />
            </li>
          </ul>
        </div>
      </>
    );
  }
}
