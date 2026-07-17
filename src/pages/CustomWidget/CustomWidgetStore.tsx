import { DefaultApiFactory } from "@opendonationassistant/oda-streamelements-service-client";
import { makeAutoObservable } from "mobx";
import { subscribe } from "../../socket";
import { log } from "../../logging";
import { CustomWidgetSettings } from "./CustomWidgetSettings";

export interface CustomWidgetStore {
  session: any;
}

export class DemoCustomWidgetStore implements CustomWidgetStore {
  public session: any = {
    session: {
      data: {
        "follower-latest": { name: "denimanev65" },
        "follower-session": { count: 4 },
        "follower-week": { count: 4 },
        "follower-month": { count: 4 },
        "follower-goal": { amount: 6 },
        "follower-total": { count: 23 },
        "subscriber-latest": {
          name: "",
          amount: 0,
          tier: "",
          message: "",
        },
        "subscriber-new-latest": { name: "", amount: 0, message: "" },
        "subscriber-resub-latest": { name: "", amount: 0, message: "" },
        "subscriber-gifted-latest": {
          name: "",
          amount: 0,
          message: "",
          tier: "",
          sender: "",
        },
        "subscriber-session": { count: 0 },
        "subscriber-new-session": { count: 0 },
        "subscriber-resub-session": { count: 0 },
        "subscriber-gifted-session": { count: 0 },
        "subscriber-week": { count: 0 },
        "subscriber-month": { count: 0 },
        "subscriber-goal": { amount: 0 },
        "subscriber-total": { count: 0 },
        "subscriber-points": { amount: 0 },
        "subscriber-alltime-gifter": { name: "", amount: 0 },
        "host-latest": { name: "", amount: 0 },
        "raid-latest": { name: "nezhnaya_animeshka", amount: 1 },
        "charityCampaignDonation-latest": { name: "", amount: 0 },
        "charityCampaignDonation-session-top-donation": {
          amount: 0,
          name: "",
        },
        "charityCampaignDonation-weekly-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-monthly-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-alltime-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-session-top-donator": {
          amount: 0,
          name: "",
        },
        "charityCampaignDonation-weekly-top-donator": { name: "", amount: 0 },
        "charityCampaignDonation-monthly-top-donator": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-alltime-top-donator": {
          name: "",
          amount: 0,
        },
        "cheer-session": { amount: 0 },
        "cheer-week": { amount: 0 },
        "cheer-month": { amount: 0 },
        "cheer-total": { amount: 0 },
        "cheer-count": { count: 0 },
        "cheer-goal": { amount: 0 },
        "cheer-latest": { name: "", amount: 0 },
        "cheer-session-top-donation": { amount: 0, name: "" },
        "cheer-weekly-top-donation": { amount: 0, name: "" },
        "cheer-monthly-top-donation": { amount: 0, name: "" },
        "cheer-alltime-top-donation": { amount: 0, name: "" },
        "cheer-session-top-donator": { amount: 0, name: "" },
        "cheer-weekly-top-donator": { amount: 0, name: "" },
        "cheer-monthly-top-donator": { amount: 0, name: "" },
        "cheer-alltime-top-donator": { amount: 0, name: "" },
        "cheerPurchase-latest": { name: "", amount: 0 },
        "cheerPurchase-session-top-donation": { amount: 0, name: "" },
        "cheerPurchase-weekly-top-donation": { name: "", amount: 0 },
        "cheerPurchase-monthly-top-donation": { name: "", amount: 0 },
        "cheerPurchase-alltime-top-donation": { name: "", amount: 0 },
        "cheerPurchase-session-top-donator": { amount: 0, name: "" },
        "cheerPurchase-weekly-top-donator": { name: "", amount: 0 },
        "cheerPurchase-monthly-top-donator": { name: "", amount: 0 },
        "cheerPurchase-alltime-top-donator": { name: "", amount: 0 },
        "superchat-latest": { name: "", amount: 0 },
        "superchat-session-top-donation": { amount: 0, name: "" },
        "superchat-weekly-top-donation": { name: "", amount: 0 },
        "superchat-monthly-top-donation": { name: "", amount: 0 },
        "superchat-alltime-top-donation": { name: "", amount: 0 },
        "superchat-session-top-donator": { amount: 0, name: "" },
        "superchat-weekly-top-donator": { name: "", amount: 0 },
        "superchat-monthly-top-donator": { name: "", amount: 0 },
        "superchat-alltime-top-donator": { name: "", amount: 0 },
        "superchat-session": { amount: 0 },
        "superchat-week": { amount: 0 },
        "superchat-month": { amount: 0 },
        "superchat-total": { amount: 0 },
        "superchat-count": { count: 0 },
        "superchat-goal": { amount: 0 },
        "hypetrain-latest": {
          active: 0,
          amount: 0,
          level: 0,
          levelChanged: 0,
          name: "",
          type: "",
        },
        "hypetrain-level-goal": { amount: 0 },
        "hypetrain-level-progress": { amount: 0, percent: 0 },
        "hypetrain-total": { amount: 0 },
        "channel-points-latest": {
          amount: 0,
          message: "",
          name: "",
          redemption: "",
        },
        "community-gift-latest": { amount: 0, name: "", tier: "" },
        "tip-latest": { name: "", amount: 0 },
        "tip-session-top-donation": { amount: 0, name: "" },
        "tip-weekly-top-donation": { name: "", amount: 0 },
        "tip-monthly-top-donation": { name: "", amount: 0 },
        "tip-alltime-top-donation": { name: "", amount: 0 },
        "tip-session-top-donator": { amount: 0, name: "" },
        "tip-weekly-top-donator": { name: "", amount: 0 },
        "tip-monthly-top-donator": { name: "", amount: 0 },
        "tip-alltime-top-donator": { name: "", amount: 0 },
        "tip-session": { amount: 0 },
        "tip-week": { amount: 0 },
        "tip-month": { amount: 0 },
        "tip-total": { amount: 0 },
        "tip-count": { count: 0 },
        "tip-goal": { amount: 100 },
        "merch-goal-orders": { amount: 0 },
        "merch-goal-items": { amount: 0 },
        "merch-goal-total": { amount: 0 },
        "merch-latest": { name: "", amount: 0, items: [] },
        "purchase-latest": {
          name: "",
          amount: 0,
          avatar: "",
          message: "",
          items: [],
        },
        "follower-recent": [
          {
            name: "denimanev65",
            createdAt: "2026-05-24T17:05:29.074Z",
            type: "follower",
          }
        ],
        "subscriber-recent": [],
        "host-recent": [],
        "raid-recent": [
          {
            name: "nezhnaya_animeshka",
            amount: 1,
            createdAt: "2026-06-12T15:22:49.135Z",
            type: "raid",
          },
          {
            name: "nezhnaya_animeshka",
            amount: 2,
            createdAt: "2026-06-12T15:20:24.494Z",
            type: "raid",
          },
        ],
        "charityCampaignDonation-recent": [],
        "cheer-recent": [],
        "cheerPurchase-recent": [],
        "superchat-recent": [],
        "tip-recent": [],
        "merch-recent": [],
        "hypetrain-latest-top-contributors": [],
      },
      settings: { autoReset: true, calendar: false, resetOnStart: false },
    },
    recents: [
      {
        name: "nezhnaya_animeshka",
        createdAt: "2026-05-01T09:38:48.498Z",
        type: "follower",
      },
    ],
    currency: { code: "RUB", name: "Russian Ruble", symbol: "\u20BD" },
    channel: {
      username: "stcarolas",
      apiToken: "1234",
      id: "1234",
      providerId: "175064269",
      avatar:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/cfb38f4a-6675-43e8-b4bd-77e247f03efa-profile_image-300x300.png",
    },
    overlay: { isEditorMode: false, muted: false },
  };
}

export class DefaultCustomWidgetStore implements CustomWidgetStore {
  private _reloadFn: Function;
  private _settings: CustomWidgetSettings;
  private _session: any = {
    session: {
      data: {
        "follower-latest": { name: "denimanev65" },
        "follower-session": { count: 4 },
        "follower-week": { count: 4 },
        "follower-month": { count: 4 },
        "follower-goal": { amount: 6 },
        "follower-total": { count: 23 },
        "subscriber-latest": {
          name: "",
          amount: 0,
          tier: "",
          message: "",
        },
        "subscriber-new-latest": { name: "", amount: 0, message: "" },
        "subscriber-resub-latest": { name: "", amount: 0, message: "" },
        "subscriber-gifted-latest": {
          name: "",
          amount: 0,
          message: "",
          tier: "",
          sender: "",
        },
        "subscriber-session": { count: 0 },
        "subscriber-new-session": { count: 0 },
        "subscriber-resub-session": { count: 0 },
        "subscriber-gifted-session": { count: 0 },
        "subscriber-week": { count: 0 },
        "subscriber-month": { count: 0 },
        "subscriber-goal": { amount: 0 },
        "subscriber-total": { count: 0 },
        "subscriber-points": { amount: 0 },
        "subscriber-alltime-gifter": { name: "", amount: 0 },
        "host-latest": { name: "", amount: 0 },
        "raid-latest": { name: "nezhnaya_animeshka", amount: 1 },
        "charityCampaignDonation-latest": { name: "", amount: 0 },
        "charityCampaignDonation-session-top-donation": {
          amount: 0,
          name: "",
        },
        "charityCampaignDonation-weekly-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-monthly-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-alltime-top-donation": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-session-top-donator": {
          amount: 0,
          name: "",
        },
        "charityCampaignDonation-weekly-top-donator": { name: "", amount: 0 },
        "charityCampaignDonation-monthly-top-donator": {
          name: "",
          amount: 0,
        },
        "charityCampaignDonation-alltime-top-donator": {
          name: "",
          amount: 0,
        },
        "cheer-session": { amount: 0 },
        "cheer-week": { amount: 0 },
        "cheer-month": { amount: 0 },
        "cheer-total": { amount: 0 },
        "cheer-count": { count: 0 },
        "cheer-goal": { amount: 0 },
        "cheer-latest": { name: "", amount: 0 },
        "cheer-session-top-donation": { amount: 0, name: "" },
        "cheer-weekly-top-donation": { amount: 0, name: "" },
        "cheer-monthly-top-donation": { amount: 0, name: "" },
        "cheer-alltime-top-donation": { amount: 0, name: "" },
        "cheer-session-top-donator": { amount: 0, name: "" },
        "cheer-weekly-top-donator": { amount: 0, name: "" },
        "cheer-monthly-top-donator": { amount: 0, name: "" },
        "cheer-alltime-top-donator": { amount: 0, name: "" },
        "cheerPurchase-latest": { name: "", amount: 0 },
        "cheerPurchase-session-top-donation": { amount: 0, name: "" },
        "cheerPurchase-weekly-top-donation": { name: "", amount: 0 },
        "cheerPurchase-monthly-top-donation": { name: "", amount: 0 },
        "cheerPurchase-alltime-top-donation": { name: "", amount: 0 },
        "cheerPurchase-session-top-donator": { amount: 0, name: "" },
        "cheerPurchase-weekly-top-donator": { name: "", amount: 0 },
        "cheerPurchase-monthly-top-donator": { name: "", amount: 0 },
        "cheerPurchase-alltime-top-donator": { name: "", amount: 0 },
        "superchat-latest": { name: "", amount: 0 },
        "superchat-session-top-donation": { amount: 0, name: "" },
        "superchat-weekly-top-donation": { name: "", amount: 0 },
        "superchat-monthly-top-donation": { name: "", amount: 0 },
        "superchat-alltime-top-donation": { name: "", amount: 0 },
        "superchat-session-top-donator": { amount: 0, name: "" },
        "superchat-weekly-top-donator": { name: "", amount: 0 },
        "superchat-monthly-top-donator": { name: "", amount: 0 },
        "superchat-alltime-top-donator": { name: "", amount: 0 },
        "superchat-session": { amount: 0 },
        "superchat-week": { amount: 0 },
        "superchat-month": { amount: 0 },
        "superchat-total": { amount: 0 },
        "superchat-count": { count: 0 },
        "superchat-goal": { amount: 0 },
        "hypetrain-latest": {
          active: 0,
          amount: 0,
          level: 0,
          levelChanged: 0,
          name: "",
          type: "",
        },
        "hypetrain-level-goal": { amount: 0 },
        "hypetrain-level-progress": { amount: 0, percent: 0 },
        "hypetrain-total": { amount: 0 },
        "channel-points-latest": {
          amount: 0,
          message: "",
          name: "",
          redemption: "",
        },
        "community-gift-latest": { amount: 0, name: "", tier: "" },
        "tip-latest": { name: "", amount: 0 },
        "tip-session-top-donation": { amount: 0, name: "" },
        "tip-weekly-top-donation": { name: "", amount: 0 },
        "tip-monthly-top-donation": { name: "", amount: 0 },
        "tip-alltime-top-donation": { name: "", amount: 0 },
        "tip-session-top-donator": { amount: 0, name: "" },
        "tip-weekly-top-donator": { name: "", amount: 0 },
        "tip-monthly-top-donator": { name: "", amount: 0 },
        "tip-alltime-top-donator": { name: "", amount: 0 },
        "tip-session": { amount: 0 },
        "tip-week": { amount: 0 },
        "tip-month": { amount: 0 },
        "tip-total": { amount: 0 },
        "tip-count": { count: 0 },
        "tip-goal": { amount: 100 },
        "merch-goal-orders": { amount: 0 },
        "merch-goal-items": { amount: 0 },
        "merch-goal-total": { amount: 0 },
        "merch-latest": { name: "", amount: 0, items: [] },
        "purchase-latest": {
          name: "",
          amount: 0,
          avatar: "",
          message: "",
          items: [],
        },
        "follower-recent": [
          {
            name: "denimanev65",
            createdAt: "2026-05-24T17:05:29.074Z",
            type: "follower",
          },
          {
            name: "nezhnaya_animeshka",
            createdAt: "2026-05-01T09:38:48.498Z",
            type: "follower",
          },
          {
            name: "nezhnaya_animeshka",
            createdAt: "2026-01-07T07:23:34.671Z",
            type: "follower",
          },
          {
            name: "maxmanorn",
            createdAt: "2025-06-22T15:58:36.429Z",
            type: "follower",
          },
          {
            name: "night_story_games",
            createdAt: "2023-09-22T21:17:56.415Z",
            type: "follower",
          },
          {
            name: "loser_lover",
            createdAt: "2023-08-19T02:50:37.263Z",
            type: "follower",
          },
        ],
        "subscriber-recent": [],
        "host-recent": [],
        "raid-recent": [
          {
            name: "nezhnaya_animeshka",
            amount: 1,
            createdAt: "2026-06-12T15:22:49.135Z",
            type: "raid",
          },
          {
            name: "nezhnaya_animeshka",
            amount: 2,
            createdAt: "2026-06-12T15:20:24.494Z",
            type: "raid",
          },
        ],
        "charityCampaignDonation-recent": [],
        "cheer-recent": [],
        "cheerPurchase-recent": [],
        "superchat-recent": [],
        "tip-recent": [],
        "merch-recent": [],
        "hypetrain-latest-top-contributors": [],
      },
      settings: { autoReset: true, calendar: false, resetOnStart: false },
    },
    recents: [
      {
        name: "nezhnaya_animeshka",
        createdAt: "2026-05-01T09:38:48.498Z",
        type: "follower",
      },
      {
        name: "nezhnaya_animeshka",
        createdAt: "2026-01-07T07:23:34.671Z",
        type: "follower",
      },
      {
        name: "maxmanorn",
        createdAt: "2025-06-22T15:58:36.429Z",
        type: "follower",
      },
      {
        name: "night_story_games",
        createdAt: "2023-09-22T21:17:56.415Z",
        type: "follower",
      },
      {
        name: "loser_lover",
        createdAt: "2023-08-19T02:50:37.263Z",
        type: "follower",
      },
      {
        name: "nezhnaya_animeshka",
        amount: 1,
        createdAt: "2026-06-12T15:22:49.135Z",
        type: "raid",
      },
      {
        name: "nezhnaya_animeshka",
        amount: 2,
        createdAt: "2026-06-12T15:20:24.494Z",
        type: "raid",
      },
    ],
    currency: { code: "RUB", name: "Russian Ruble", symbol: "\u20BD" },
    channel: {
      username: "stcarolas",
      apiToken: "1234",
      id: "1234",
      providerId: "175064269",
      avatar:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/cfb38f4a-6675-43e8-b4bd-77e247f03efa-profile_image-300x300.png",
    },
    fieldData: {
      display_text_side: "bottom",
      display_title: "TIP GOAL",
      display_font: "Lato",
      display_font_weight_title: "bold",
      display_font_weight_goal: "bold",
      display_font_size_title: 25,
      display_font_size_goal: 25,
      animation_stars: true,
      animation_bottle: true,
      color_text: "#ffffff",
      color_stars: "#fefefe",
      color_bg: "rgba(1, 0, 1, 0.5)",
      color_fruit_1: "#790000",
      color_fruit_2: "#ff0006",
      color_fruit_glow: "#fefefe",
      color_participle: "#f99177",
      goal_mode: "tip",
      goal_period: "goal",
      goal_amount: 200,
      cheer_multi: 0.01,
      sub_multi: 2.5,
      animation_participle: true,
      display_size: 1,
      color_text_1: "#fefefe",
      color_text_2: "#342c89",
      test: "test",
      color_top_fruit_3: "#ffffff",
      color_text_shadow: "rgba(254, 254, 254, 0)",
      color_border: "rgb(254, 254, 254)",
      color_cloud_1: "rgb(254, 254, 254)",
      color_cloud_2: "rgb(18, 18, 18)",
      color_cloud_glow: "#5c55b2",
      color_stars_glow: "#f99177",
      goal_v: -194,
      goal_h: 34,
      title_v: 141,
      title_h: -215,
      goal_cloud: "cloud_tail_top",
      title_cloud: "cloud_tail_down",
      color_border1: "#fefefe",
      symbolEnd: false,
      symbolPos: "right",
      cointresub: false,
      sub_multi1: 2.5,
      sub_multi2: 2.5,
      sub_multi3: 2.5,
      color_top_fruit_top: "#ff7b79",
      color_top_fruit_bottom: "#fee45e",
      color_top_fruit_back: "#ffffff",
      color_top_fruit_glow: "#f99177",
      padding_v: 5,
      padding_h: 2,
      goal_cloud_tail: "reverse",
      title_cloud_tail: " ",
      prefix: "!",
      new_title: "title",
      new_target: "goal",
      enable_mod: true,
      add_amount: "add",
    },
    overlay: { isEditorMode: false, muted: false },
  };

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_STREAMELEMENTS_API_ENDPOINT,
    );
  }

  constructor({
    settings,
    widgetId,
    recipientId,
    reloadFn,
  }: {
    settings: CustomWidgetSettings;
    widgetId: string;
    recipientId: string;
    reloadFn: Function;
  }) {
    this._reloadFn = reloadFn;
    this._settings = settings;
    settings
      .configContent()
      .then((content) => {
        this._session.fieldData = content;
      })
      .then(() => {
        return this.client().getSession();
      })
      .then((session) => {
        this._session.session = session.data.session;
        this._session.channel = session.data.channel;
      });
    makeAutoObservable(this);
    this.listen(widgetId, `/topic/${recipientId}.streamelements`);
  }

  private listen(widgetId: string, topic: string) {
    subscribe(widgetId, topic, (message) => {
      let json = JSON.parse(message.body);
      log.info({ message: json, widgetId: widgetId }, "Received SE message");
      this._reloadFn();
      message.ack();
    });
  }

  public get session() {
    return this._session;
  }
}
