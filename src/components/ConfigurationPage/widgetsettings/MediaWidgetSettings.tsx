import { ReactNode } from "react";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";
import { MaxLen } from "./media/MaxLen";
import { Tarification } from "./media/Tarification";
import { WordsBlacklist } from "./media/WordsBlacklist";
import { RequestAllowRule } from "./media/RequestAllowRule";
import { reaction } from "mobx";
import { Trans } from "react-i18next";

export class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    const vkRequests = new BooleanProperty({
      name: "vkvideoEnabled",
      value: true,
      displayName: "media-requests-vkvideo",
    });
    const tarification = new Tarification();
    reaction(
      () => tarification.value.method,
      () => {
        if (tarification.value.method === "perMinute") {
          vkRequests.value = false;
        }
      },
    );
    reaction(
      () => vkRequests.value,
      () => {
        if (vkRequests.value) {
          tarification.value.method = "perLink";
        }
      },
    );
    super({
      sections: [
        {
          key: "general",
          title: "General",
          properties: [
            new BooleanProperty({
              name: "requestsEnabled",
              value: true,
              displayName: "media-requests-enabled",
            }),
            new BooleanProperty({
              name: "youtubeEnabled",
              value: true,
              displayName: "media-requests-youtube",
            }),
            vkRequests,
            new BooleanProperty({
              name: "showQueueSizeOnPage",
              value: true,
              displayName:
                "media-show-queue-size-on-page",
            }),
            tarification,
            new NumberProperty({
              name: "songMaxAmount",
              value: 12,
              displayName: "media-max-videos-per-donation",
            }),
            new NumberProperty({
              name: "requestViewAmount",
              value: 100,
              displayName: "media-min-views",
            }),
            new MaxLen(),
            new TextProperty({
              name: "requestTooltip",
              value: "",
              displayName: "media-request-tooltip-text",
            }),
            new WordsBlacklist(),
          ],
        },
        {
          key: "appearance",
          title: "media-appearance-section",
          properties: [
            new NumberProperty({
              name: "playlistSongTitleFontSize",
              value: 16,
              addon: "px",
              displayName: "widget-media-title-font-size",
            }),
            new NumberProperty({
              name: "playlistNicknameFontSize",
              value: 16,
              addon: "px",
              displayName: "widget-media-customer-font-size",
            }),
          ],
        },
        {
          key: "twitch-requests",
          title: "Twitch",
          properties: [
            new BooleanProperty({
              name: "twitchPointsRequestsEnabled",
              value: false,
              displayName: "media-points-request",
            }),
            new TextProperty({
              name: "music-twitch-request-title",
              value: "Заказ музыки",
              displayName: "media-reward-name",
            }),
            new NumberProperty({
              name: "music-twitch-request-cost",
              value: 100,
              displayName: "media-reward-cost",
            }),
            new RequestAllowRule({
              name: "music-twitch-request-allow",
              roleIds: ["broadcaster", "moderator", "vip", "subscriber"],
            }),
          ],
        },
        {
          key: "vklive-requests",
          title: "VKLive",
          properties: [
            new BooleanProperty({
              name: "vklivePointsRequestsEnabled",
              value: false,
              displayName: "media-points-request",
            }),
            new TextProperty({
              name: "music-vklive-request-title",
              value: "Заказ музыки",
              displayName: "media-reward-name",
            }),
            new NumberProperty({
              name: "music-vklive-request-cost",
              value: 100,
              displayName: "media-reward-cost",
            }),
            new RequestAllowRule({
              name: "music-vklive-request-allow",
              roleIds: ["broadcaster", "subscriber"],
            }),
          ],
        },
        {
          key: "kick-requests",
          title: "Kick",
          properties: [
            new BooleanProperty({
              name: "kickPointsRequestsEnabled",
              value: false,
              displayName: "media-points-request",
            }),
            new TextProperty({
              name: "music-kick-request-title",
              value: "Заказ музыки",
              displayName: "media-reward-name",
            }),
            new NumberProperty({
              name: "music-kick-request-cost",
              value: 100,
              displayName: "media-reward-cost",
            }),
            new RequestAllowRule({
              name: "music-kick-request-allow",
              roleIds: ["broadcaster", "subscriber"],
            }),
          ],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>
            <Trans i18nKey="media-help-title" />
          </h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          <Trans i18nKey="media-help-description" />
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="widget-help-howto-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="media-help-step-copy-link" />
            </li>
            <li>
              <Trans i18nKey="media-help-step-paste-dock" />
            </li>
            <li>
              <Trans i18nKey="media-help-step-price" />
            </li>
          </ul>
        </div>
        <h3 className={`${classes.helptitle}`}>
          <Trans i18nKey="media-help-faq-title" />
        </h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              <Trans i18nKey="media-help-faq-alert-pause" />
            </li>
            <li>
              <Trans i18nKey="media-help-faq-toggle" />
            </li>
            <li>
              <Trans i18nKey="media-help-faq-copies" />
            </li>
            <li>
              <Trans i18nKey="media-help-faq-remote" />
            </li>
          </ul>
        </div>
      </>
    );
  }
}
