import axios from "axios";
import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { HistoryWidgetSettings } from "../pages/History/HistoryWidgetSettings";
import { action, makeObservable, observable } from "mobx";
import { WidgetStore } from "../stores/WidgetStore";
import { PlayerPopupWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import { MediaWidgetSettings } from "../components/ConfigurationPage/widgetsettings/MediaWidgetSettings";
import { PlayerInfoWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerInfoWidgetSettings";
import { DonatersTopListWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { DonationTimerWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { DonationGoalWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { PaymentAlertsWidgetSettings } from "../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { PlayerControlWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerControlWidgetSettings";
import { DonatonWidgetSettings } from "../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import { RutonyChatSettings } from "../pages/RutonyChat/RutonyChatSettings";
import { tokenRequest } from "../pages/Login/Login";
import { HorizontalEventsWidgetSettings } from "../pages/HorizontalEvents/HorizontalEventsWidgetSettings";
import { ReactNode, createContext } from "react";
import AlertsIcon from "../icons/widgets/AlertsIcon";
import { RouletteWidgetSettings } from "../pages/Roulette/RouletteWidgetSettings";
import DonationGoalIcon from "../icons/DonationGoalIcon";
import TopListIcon from "../icons/widgets/TopListIcon";
import SongIcon from "../icons/SongIcon";
import HistoryIcon from "../icons/HistoryIcon";
import InfoIcon from "../icons/InfoIcon";
import ClockIcon from "../icons/widgets/ClockIcon";
import HourglassIcon from "../icons/widgets/HourglassIcon";
import ReelIcon from "../icons/ReelIcon";
import VideoIcon from "../icons/widgets/VideoIcon";
import IntegrationIcon from "../icons/IntegrationIcon";
import EventFeedIcon from "../icons/widgets/EventFeedIcon";
import RouletteIcon from "../icons/widgets/RouletteIcon";
import { ReelWidgetSettings } from "../pages/Reel/ReelWidgetSettings";
import { StreamCreditsWidgetSettings } from "../pages/StreamCredits/StreamCreditsWidgetSettings";
import { AuctionWidgetSettings } from "../pages/AuctionWidget/AuctionWidgetSettings";
import { CanvasWidgetSettings } from "../components/ConfigurationPage/widgetsettings/canvas/CanvasWidgetSettings";
import { CustomWidgetSettings } from "../pages/CustomWidget/CustomWidgetSettings";
import { ChatWidgetSettings } from "../pages/ChatWidget/ChatWidgetSettings";
import { EmoteWallWidgetSettings } from "../pages/EmoteWall/EmoteWallWidgetSettings";

export const WIDGET_TYPES = [
  {
    name: "payment-alerts",
    title: "widget-type-payment-alerts-title",
    icon: <AlertsIcon />,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/alert.png",
    description: "widget-type-payment-alerts-description",
    create: () => new PaymentAlertsWidgetSettings(),
  },
  {
    name: "donationgoal",
    title: "widget-type-donationgoal-title",
    icon: <DonationGoalIcon />,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donationgoal.png",
    description: "widget-type-donationgoal-description",
    create: () => new DonationGoalWidgetSettings(),
  },
  {
    name: "donaters-top-list",
    title: "widget-type-donaters-top-list-title",
    icon: <TopListIcon />,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/toplist.png",
    description: "widget-type-donaters-top-list-description",
    create: () => new DonatersTopListWidgetSettings(),
  },
  {
    name: "media",
    title: "widget-type-media-title",
    icon: <SongIcon />,
    preview: "https://api.oda.digital/assets/mediaplayer.png",
    category: "media",
    description: "widget-type-media-description",
    create: () => {
      return new MediaWidgetSettings();
    },
  },
  {
    name: "payments",
    title: "widget-type-payments-title",
    icon: <HistoryIcon color="var(--oda-color-1000)" />,
    category: "internal",
    preview: "https://api.oda.digital/assets/payments.png",
    description: "widget-type-payments-description",
    create: () => new HistoryWidgetSettings(),
  },
  {
    name: "donation-timer",
    title: "widget-type-donation-timer-title",
    icon: <ClockIcon />,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donationtimer.png",
    description: "widget-type-donation-timer-description",
    create: () => new DonationTimerWidgetSettings(),
  },
  {
    name: "player-info",
    title: "widget-type-player-info-title",
    icon: <InfoIcon />,
    category: "media",
    preview: "https://api.oda.digital/assets/playerinfo.png",
    description: "widget-type-player-info-description",
    create: () => new PlayerInfoWidgetSettings(),
  },
  {
    name: "donaton",
    title: "widget-type-donaton-title",
    icon: <HourglassIcon />,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donaton.png",
    description: "widget-type-donaton-description",
    create: () => new DonatonWidgetSettings(),
  },
  {
    name: "horizontal-events",
    title: "widget-type-horizontal-events-title",
    icon: <EventFeedIcon />,
    category: "onscreen",
    preview: "",
    description: "widget-type-horizontal-events-description",
    create: () => new HorizontalEventsWidgetSettings(),
  },
  {
    name: "reel",
    title: "widget-type-reel-title",
    icon: <ReelIcon />,
    category: "onscreen",
    preview: "",
    description: "widget-type-reel-description",
    create: () => new ReelWidgetSettings(),
  },
  {
    name: "player-popup",
    title: "widget-type-player-popup-title",
    icon: <VideoIcon />,
    category: "media",
    preview: "https://api.oda.digital/assets/popup.png",
    description: "widget-type-player-popup-description",
    create: () => {
      return new PlayerPopupWidgetSettings();
    },
  },
  {
    name: "rutonychat",
    title: "widget-type-rutonychat-title",
    icon: <IntegrationIcon />,
    category: "internal",
    preview: "",
    description: "widget-type-rutonychat-description",
    create: () => new RutonyChatSettings(),
  },
  {
    name: "player-control",
    title: "widget-type-player-control-title",
    icon: <span className="material-symbols-sharp">settings_remote</span>,
    category: "media",
    preview: "",
    description: "widget-type-player-control-description",
    create: () => new PlayerControlWidgetSettings(),
  },
  {
    name: "roulette",
    title: "widget-type-roulette-title",
    icon: <RouletteIcon />,
    category: "onscreen",
    preview: "",
    description: "widget-type-roulette-description",
    create: () => new RouletteWidgetSettings(),
  },
  {
    name: "action-queue",
    title: "widget-type-action-queue-title",
    icon: <span className="material-symbols-sharp">pending_actions</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-action-queue-description",
    create: () => new RouletteWidgetSettings(),
  },
  {
    name: "stream-credits",
    title: "widget-type-stream-credits-title",
    icon: <span className="material-symbols-sharp">pending_actions</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-stream-credits-description",
    create: () => new StreamCreditsWidgetSettings(),
  },
  {
    name: "auction",
    title: "widget-type-auction-title",
    icon: <span className="material-symbols-sharp">gavel</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-auction-description",
    create: () => new AuctionWidgetSettings(),
  },
  {
    name: "canvas",
    title: "widget-type-canvas-title",
    icon: <span className="material-symbols-sharp">dashboard</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-canvas-description",
    create: () => new CanvasWidgetSettings(),
  },
  {
    name: "custom",
    title: "widget-type-custom-title",
    icon: <span className="material-symbols-sharp">tools_power_drill</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-custom-description",
    create: () => new CustomWidgetSettings(),
  },
  {
    name: "chat",
    title: "widget-type-chat-title",
    icon: <span className="material-symbols-sharp">forum</span>,
    category: "onscreen",
    preview: "",
    description: "widget-type-chat-description",
    create: () => new ChatWidgetSettings(),
  },
  {
    name: "emote-wall",
    title: "widget-type-emote-wall-title",
    icon: (
      <span className="material-symbols-sharp">sentiment_very_satisfied</span>
    ),
    category: "onscreen",
    preview: "",
    description: "widget-type-emote-wall-description",
    create: () => new EmoteWallWidgetSettings(),
  },
];

interface SavedProperty {
  name: string;
  value: any;
}

// TODO: use decorators
export class Widget {
  private _id: string;
  private _type: string;
  private _sortOrder: number;
  private _name: string;
  private _ownerId: string;
  private _config: AbstractWidgetSettings;
  private _store: WidgetStore;
  private _icon: ReactNode;
  private _enabled: boolean;

  constructor(params: {
    id: string;
    type: string;
    sortOrder: number;
    name: string;
    ownerId: string;
    enabled: boolean;
    icon: ReactNode;
    config: AbstractWidgetSettings;
    store: WidgetStore;
  }) {
    this._id = params.id;
    this._type = params.type;
    this._sortOrder = params.sortOrder;
    this._name = params.name;
    this._ownerId = params.ownerId;
    this._config = params.config;
    this._store = params.store;
    this._icon = params.icon;
    this._enabled = params.enabled;
    makeObservable<Widget, "_name" | "_config" | "_enabled">(this, {
      _name: observable,
      _config: observable,
      _enabled: observable,
      reload: action,
    });
  }

  public static createDefault(
    type: string,
  ): AbstractWidgetSettings | undefined {
    return WIDGET_TYPES.find((t) => t.name === type)?.create();
  }

  public static configFromJson(json: any): AbstractWidgetSettings | null {
    return this.config(json.type, json.config?.properties ?? []);
  }

  public static config(
    type: string,
    properties: SavedProperty[],
  ): AbstractWidgetSettings | null {
    const settings = this.createDefault(type);
    if (settings === undefined) {
      return null;
    }
    properties.forEach((prop) => {
      settings.set(prop.name, prop.value, true);
    });
    return settings;
  }

  public static fromJson(json: any, store: WidgetStore): Widget | null {
    if (json.id === undefined) {
      return null;
    }
    if (json.type === undefined) {
      return null;
    }
    if (json.sortOrder === undefined) {
      return null;
    }
    if (json.name === undefined) {
      return null;
    }
    if (json.ownerId === undefined) {
      return null;
    }
    return new Widget({
      id: json.id,
      type: json.type,
      sortOrder: json.sortOrder,
      name: json.name,
      ownerId: json.ownerId,
      enabled:
        json.enabled === null || json.enabled === undefined
          ? true
          : json.enabled,
      icon: WIDGET_TYPES.filter((type) => type.name === json.type).at(0)
        ?.icon ?? <></>,
      config:
        this.configFromJson(json) ||
        new AbstractWidgetSettings({ sections: [] }),
      store: store,
    });
  }

  public copy(): Promise<Widget | null> {
    return this._store.addWidget(this.type).then((widget) => {
      if (widget) {
        widget.setConfig(this.config.copy());
      }
      return widget;
    });
  }

  private setConfig(config: AbstractWidgetSettings) {
    this._config = config;
  }

  public async reload(): Promise<void> {
    await axios
      .get(`${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${this._id}`)
      .then((response) => {
        this.setConfig(
          Widget.configFromJson(response.data) ||
            new AbstractWidgetSettings({ sections: [] }),
        );
      });
  }

  public async rename(name: string): Promise<void> {
    const request = {
      name: name,
    };
    await axios.patch(
      `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${this._id}`,
      request,
    );
    this.name = name;
  }

  public async save(): Promise<void> {
    const properties = await this._config.prepareConfig();
    const request = {
      name: this._name,
      config: {
        properties: properties,
      },
    };
    await axios
      .patch(
        `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${this._id}`,
        request,
      )
      .then(() => {
        this.config.markSaved();
      });
  }

  async url() {
    const tokens = await tokenRequest({
      refreshToken: localStorage.getItem("refresh-token") ?? "",
    });
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_ENDPOINT}/${this._type}/${this._id}?refresh-token=${tokens.refreshToken}`,
    );
  }
  async delete(): Promise<void> {
    await this._store.deleteWidget(this._id);
  }
  public get id(): string {
    return this._id;
  }
  public get type(): string {
    return this._type;
  }
  public get sortOrder(): number {
    return this._sortOrder;
  }
  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }
  public get ownerId(): string {
    return this._ownerId;
  }
  public get icon(): ReactNode {
    return this._icon;
  }
  public get enabled(): boolean {
    return this._enabled;
  }
  public toggle(): void {
    this._store.toggleWidget(this._id);
    this._enabled = !this._enabled;
  }
  public get config(): AbstractWidgetSettings {
    return this._config;
  }
  public get subactions(): ReactNode {
    return this._config.subactions(this._id);
  }
}

export const WidgetContext = createContext<Widget | null>(null);
