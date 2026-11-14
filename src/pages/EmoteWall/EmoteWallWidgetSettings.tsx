import { ReactNode } from "react";
import { Flex } from "antd";
import { Trans } from "react-i18next";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { EmoteWallWidget } from "./EmoteWallWidget";
import { DemoEmoteWallWidgetStore } from "./EmoteWallWidgetStore";

export class EmoteWallWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "widget",
          title: "Entire",
          properties: [
            new WidthProperty({
              name: "width",
              displayName: "common-width",
            }),
            new HeightProperty({
              name: "height",
              displayName: "common-height",
            }),
          ],
        },
        {
          key: "emotes",
          title: "emote-wall-tab-emotes",
          properties: [
            new NumberProperty({
              name: "emoteSize",
              value: 64,
              addon: "px",
              displayName: "emote-wall-emote-size",
            }),
            new NumberProperty({
              name: "animationDuration",
              value: 4000,
              addon: "ms",
              displayName: "animation-duration",
            }),
            new NumberProperty({
              name: "maxConcurrentEmotes",
              value: 30,
              displayName: "emote-wall-max-emotes",
            }),
          ],
        },
      ],
    });
  }

  public get widthProperty(): WidthProperty {
    return this.get("width") as WidthProperty;
  }

  public get heightProperty(): HeightProperty {
    return this.get("height") as HeightProperty;
  }

  public get emoteSizeProperty(): NumberProperty {
    return this.get("emoteSize") as NumberProperty;
  }

  public get animationDurationProperty(): NumberProperty {
    return this.get("animationDuration") as NumberProperty;
  }

  public get maxConcurrentEmotesProperty(): NumberProperty {
    return this.get("maxConcurrentEmotes") as NumberProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="emote-wall-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="emote-wall-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-how-to-connect" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="emote-wall-help-copy-link" />
            </li>
            <li>
              <Trans i18nKey="widget-help-paste-link" />
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
    return (
      <EmoteWallWidget
        store={
          new DemoEmoteWallWidgetStore({
            maxConcurrentEmotes: this.maxConcurrentEmotesProperty.value,
            animationDuration: this.animationDurationProperty.value,
          })
        }
        settings={this}
      />
    );
  }
}