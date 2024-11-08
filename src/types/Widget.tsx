import axios from "axios";
import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { PaymentsWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PaymentsWidgetSettings";
import { action, makeObservable, observable } from "mobx";
import { tokenRequest } from "../components/Login/Login";
import { WidgetStore } from "../components/ConfigurationPage/WidgetStore";
import { PlayerPopupWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import { MediaWidgetSettings } from "../components/ConfigurationPage/widgetsettings/MediaWidgetSettings";
import { PlayerInfoWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerInfoWidgetSettings";
import { DonatersTopListWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { DonationTimerWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { DonationGoalWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { ReelWidgetSettings } from "../components/ConfigurationPage/widgetsettings/ReelWidgetSettings";
import { PaymentAlertsWidgetSettings } from "../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { ReactNode } from "react";
import { PlayerControlWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerControlWidgetSettings";

export const WIDGET_TYPES = [
  {
    name: "media",
    title: "Media Player",
    description: "Music Player",
    create: () => new MediaWidgetSettings(),
  },
  {
    name: "player-popup",
    description: "Video Popup",
    create: () => new PlayerPopupWidgetSettings(),
  },
  {
    name: "payments",
    description: "Payment History",
    create: () => new PaymentsWidgetSettings(),
  },
  {
    name: "player-control",
    description: "Music Player Remote Control",
    create: () => new PlayerControlWidgetSettings(),
  },
  {
    name: "player-info",
    description: "Music Player Info",
    create: () => new PlayerInfoWidgetSettings(),
  },
  {
    name: "donaters-top-list",
    description: "Donaters List",
    create: () => new DonatersTopListWidgetSettings(),
  },
  {
    name: "donation-timer",
    description: "Donation Timer",
    create: () => new DonationTimerWidgetSettings(),
  },
  {
    name: "donationgoal",
    description: "Donation Goals",
    create: () => new DonationGoalWidgetSettings(),
  },
  {
    name: "reel",
    description: "Roulette",
    create: () => new ReelWidgetSettings(),
  },
  {
    name: "payment-alerts",
    description: "Payment Alerts",
    create: () => new PaymentAlertsWidgetSettings(),
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

  constructor(params: {
    id: string;
    type: string;
    sortOrder: number;
    name: string;
    ownerId: string;
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
    makeObservable(this, {
      _name: observable,
      _config: observable,
      setConfig: action,
      reload: action,
    });
  }

  public static configFromJson(json: any): AbstractWidgetSettings | null {
    const settings = WIDGET_TYPES.find((t) => t.name === json.type)?.create();
    if (settings === undefined) {
      return null;
    }
    (json.config as { properties: SavedProperty[] }).properties.forEach(
      (prop) => {
        settings.set(prop.name, prop.value, true);
      },
    );
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
    if (json.sortOrder === undefined) {
      return null;
    }
    if (json.name === undefined) {
      return null;
    }
    if (json.ownerId === undefined) {
      return null;
    }
    if (json.config === undefined) {
      return null;
    }
    return new Widget({
      id: json.id,
      type: json.type,
      sortOrder: json.sortOrder,
      name: json.name,
      ownerId: json.ownerId,
      config:
        this.configFromJson(json) ||
        new AbstractWidgetSettings({ sections: [] }),
      store: store,
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
    const request = {
      name: this._name,
      config: {
        properties: this._config.prepareConfig(),
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
  public get config(): AbstractWidgetSettings {
    return this._config;
  }
}
