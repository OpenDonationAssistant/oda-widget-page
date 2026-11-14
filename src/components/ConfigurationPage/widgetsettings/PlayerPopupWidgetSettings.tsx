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
import { Trans } from "react-i18next";

export class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "style",
      title: "tab-style",
      properties: [
        new BorderProperty({
          name: "widgetBorder",
          help: "player-popup-border-help",
        }),
        new RoundingProperty({
          name: "rounding",
          displayName: "rounding",
          help: "player-popup-rounding-help",
        }),
        new BoxShadowProperty({
          name: "boxShadow",
          displayName: "player-popup-shadow",
          help: "player-popup-shadow-help",
        }),
      ],
    });

    this.addSection({
      key: "general",
      title: "General",
      properties: [
        new BooleanProperty({
          name: "audioOnly",
          value: false,
          displayName: "widget-player-popup-sound-only",
          help: "player-popup-sound-only-help",
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
            <Trans i18nKey="player-popup-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="player-popup-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-howto-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="player-popup-help-step1" />
            </li>
            <li>
              <Trans i18nKey="player-popup-help-step2" />
            </li>
            <li>
              <Trans i18nKey="player-popup-help-step3" />
            </li>
            <li>
              <Trans i18nKey="player-popup-help-step4" />
            </li>
            <li>
              <Trans i18nKey="player-popup-help-step5" />
            </li>
          </ul>
        </div>
      </>
    );
  }
}
