import { toJS } from "mobx";
import { AbstractWidgetSettings } from "../AbstractWidgetSettings";
import { PaymentAlertsProperty } from "./PaymentAlertsProperty";
import { log } from "../../../../logging";
import { ReactNode } from "react";
import classes from "../AbstractWidgetSettings.module.css";
import TestAlertPopup from "../../../TestAlertPopup/TestAlertPopup";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { PremoderationProperty } from "./PremoderationProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../../Overlay/Overlay";
import { WordBlacklistProperty } from "../../widgetproperties/WordBlacklistProperty";
import { Trans } from "react-i18next";

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  private _alerts: PaymentAlertsProperty;

  constructor() {
    const defaultAlert = new PaymentAlertsProperty();
    super({
      sections: [
        {
          key: "alerts",
          title: "tab-alert-alerts",
          properties: [defaultAlert],
        },
        {
          key: "configs",
          title: "tab-alert-configs",
          properties: [
            new PremoderationProperty({}),
            new BooleanProperty({
              name: "pause-media",
              value: true,
              displayName: "alerts-pause-media-player",
            }),
            new WordBlacklistProperty({}),
          ],
        },
      ],
    });
    this._alerts = defaultAlert;
  }

  public get alerts() {
    return this._alerts;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="alerts-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="alerts-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="alerts-help-setup-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li><Trans i18nKey="alerts-help-step-add" /></li>
            <li><Trans i18nKey="alerts-help-step-condition" /></li>
            <li><Trans i18nKey="alerts-help-step-image" /></li>
            <li><Trans i18nKey="alerts-help-step-audio" /></li>
            <li><Trans i18nKey="alerts-help-step-obs" /></li>
          </ul>
        </div>
      </>
    );
  }

  public subactions(): ReactNode {
    return <TestAlertPopup />;
  }

  public async prepareConfig(): Promise<{ name: string; value: any }[]> {
    if (this._alerts === undefined) {
      return [];
    }
    return [
      {
        name: "premoderation",
        value: toJS(this.get("premoderation")?.value),
      },
      {
        name: "pause-media",
        value: this.get("pause-media")?.value,
      },
      {
        name: this._alerts.name,
        value: this._alerts.config(),
      },
    ];
  }

  public set(key: string, value: any, asInitialValue = false): void {
    log.debug(
      { key: key, value: value },
      "calling payment alerts widget settings",
    );
    this.sections = this.sections.map((section) => {
      section.properties = section.properties.map((prop) => {
        if (prop.name === key) {
          if ("alerts" === key) {
            const updated = PaymentAlertsProperty.fromConfig(value);
            this._alerts = updated;
            log.debug({ updated: toJS(updated) }, "updated payment alerts");
            if (asInitialValue) {
              updated.markSaved();
            }
            return updated;
          }
          const updated = prop.copy();
          updated.value = value;
          updated.markSaved();
          log.debug(
            { updated: toJS(updated), value: value },
            "updated payment alerts property",
          );
          return updated;
        }
        return prop;
      });
      this.makeIndex();
      return section;
    });
    log.debug(
      { sections: this.sections },
      "updated payment alert widget settings",
    );
  }

  public hasDemo(): boolean {
    return false;
  }
}
