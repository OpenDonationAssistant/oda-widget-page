import { produce } from "immer";
import {
  AnimatedFontProperty,
  DEFAULT_FONT_PROPERTY_VALUE,
  FontPropertyValue,
} from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { ReactNode, createContext } from "react";
import { Flex } from "antd";
import { Trans } from "react-i18next";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { GRADIENT_TYPE } from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";

const fontTemplate: FontPropertyValue = {
  family: "Mulish",
  size: 24,
  color: {
    gradient: false,
    gradientType: GRADIENT_TYPE.LINEAR,
    repeating: false,
    colors: [{ color: "#FFFFFF" }],
    angle: 0,
  },
  outline: {
    enabled: false,
    width: 0,
    color: "#000000",
  },
  weight: false,
  italic: false,
  underline: false,
  shadows: [],
  animation: "none",
  animationType: "entire",
  animationSpeed: "slow",
};

export class HistoryWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "tab-reel-general",
          properties: [
            new BooleanProperty({
              name: "showGoals",
              value: false,
              displayName: "history-settings-show-goals",
            }),
            new BooleanProperty({
              name: "showRequests",
              value: false,
              displayName: "history-settings-show-requests",
            }),
            new NumberProperty({
              name: "nicknameFontSize",
              value: 18,
              displayName: "history-settings-nickname-font-size",
              addon: "px",
            }),
            new NumberProperty({
              name: "messageFontSize",
              value: 15,
              displayName: "history-settings-message-font-size",
              addon: "px",
            }),
            new NumberProperty({
              name: "goalFontSize",
              value: 18,
              displayName: "history-settings-goal-font-size",
              addon: "px",
            }),
            new NumberProperty({
              name: "musicFontSize",
              value: 15,
              displayName: "history-settings-requests-font-size",
              addon: "px",
            }),
            new NumberProperty({
              name: "actionsFontSize",
              value: 15,
              displayName: "history-settings-actions-font-size",
              addon: "px",
            }),
            new NumberProperty({
              name: "reelFontSize",
              value: 15,
              displayName: "history-settings-reel-font-size",
              addon: "px",
            }),
          ],
        },
      ],
    });
  }

  public get showGoalsProperty(): BooleanProperty {
    return this.get("showGoals") as BooleanProperty;
  }

  public get showRequests(): BooleanProperty {
    return this.get("showRequests") as BooleanProperty;
  }

  public get nicknameFontSize(): NumberProperty {
    return this.get("nicknameFontSize") as NumberProperty;
  }

  public get messageFontSize(): NumberProperty {
    return this.get("messageFontSize") as NumberProperty;
  }

  public get musicFontSize(): NumberProperty {
    return this.get("musicFontSize") as NumberProperty;
  }

  public get goalFontSize(): NumberProperty {
    return this.get("goalFontSize") as NumberProperty;
  }

  public get actionsFontSize(): NumberProperty {
    return this.get("actionsFontSize") as NumberProperty;
  }

  public get reelFontSize(): NumberProperty {
    return this.get("reelFontSize") as NumberProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="history-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="history-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="history-help-how-to" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="history-help-step-copy-link" />
            </li>
            <li>
              <Trans i18nKey="history-help-step-add-dock" />
            </li>
          </ul>
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="menu-guides" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <a href="https://youtu.be/nvqJ3bjTlEE">
                <Trans i18nKey="history-help-guide-dock" />
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export const HistoryWidgetSettingsContenxt = createContext(
  new HistoryWidgetSettings(),
);
