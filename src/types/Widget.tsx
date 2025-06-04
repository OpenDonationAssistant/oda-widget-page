import axios from "axios";
import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { PaymentsWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PaymentsWidgetSettings";
import { action, makeObservable, observable } from "mobx";
import { WidgetStore } from "../stores/WidgetStore";
import { PlayerPopupWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerPopupWidgetSettings";
import { MediaWidgetSettings } from "../components/ConfigurationPage/widgetsettings/MediaWidgetSettings";
import { PlayerInfoWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerInfoWidgetSettings";
import { DonatersTopListWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonatersTopListWidgetSettings";
import { DonationTimerWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationTimerWidgetSettings";
import { DonationGoalWidgetSettings } from "../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { ReelWidgetSettings } from "../components/ConfigurationPage/widgetsettings/ReelWidgetSettings";
import { PaymentAlertsWidgetSettings } from "../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { PlayerControlWidgetSettings } from "../components/ConfigurationPage/widgetsettings/PlayerControlWidgetSettings";
import { DonatonWidgetSettings } from "../components/ConfigurationPage/widgetsettings/donaton/DonatonWidgetSettings";
import { RutonyChatSettings } from "../pages/RutonyChat/RutonyChatSettings";
import { tokenRequest } from "../pages/Login/Login";
import { HorizontalEventsWidgetSettings } from "../pages/HorizontalEvents/HorizontalEventsWidgetSettings";
import { ReactNode } from "react";
import AlertsIcon from "../icons/widgets/Alerts";

export const WIDGET_TYPES = [
  {
    name: "payment-alerts",
    title: "Алерты",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/alert.png",
    description: "Показывает оповещения о получаемых донатах.",
    create: () => new PaymentAlertsWidgetSettings(),
  },
  {
    name: "donationgoal",
    title: "Цели сбора",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donationgoal.png",
    description:
      "Позволяет задать цели сбора донатов. При добавлении виджета и добавлении в нем целей, они отображаются на странице доната и доступны для выбора, а сам виджет можно показать на стриме и отслеживать прогресс.",
    create: () => new DonationGoalWidgetSettings(),
  },
  {
    name: "donaters-top-list",
    title: "Список донатеров",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/toplist.png",
    description:
      "Отображает список или топ-донатеров или последних донатеров за промежуток времени (день, месяц)",
    create: () => new DonatersTopListWidgetSettings(),
  },
  {
    name: "media",
    title: "Медиаплеер",
    icon: <AlertsIcon/>,
    preview: "https://api.oda.digital/assets/mediaplayer.png",
    category: "media",
    description:
      "Позволяет воспроизвести реквесты (музыки) из донатов. Поддерживается YouTube и VKVideo. Если реквестов нет, можно в плеере включить свой плейлист из YouTube - если будет реквест в донате, плеер автоматически переключится на него, а потом обратно на свой плейлист.",
    create: () => {
      return new MediaWidgetSettings();
    },
  },
  {
    name: "payments",
    title: "События",
    icon: <AlertsIcon/>,
    category: "internal",
    preview: "https://api.oda.digital/assets/payments.png",
    description:
      "Показывает список донатов, обновляется в реальном времени. Также есть кнопки для прерывания/повтора алерта на стриме.",
    create: () => new PaymentsWidgetSettings(),
  },
  {
    name: "donation-timer",
    title: "Счётчик времени без поддержки",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donationtimer.png",
    description:
      "Отображает время прошедшее после последней поддержки. Обновляется в реальном времени.",
    create: () => new DonationTimerWidgetSettings(),
  },
  {
    name: "player-info",
    title: "Информация для медиаплеера",
    icon: <AlertsIcon/>,
    category: "media",
    preview: "https://api.oda.digital/assets/playerinfo.png",
    description:
      "Выводит информацию для медиаплеера: название и количество заказов в очереди",
    create: () => new PlayerInfoWidgetSettings(),
  },
  {
    name: "donaton",
    title: "Таймер до конца трансляции",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "https://api.oda.digital/assets/donaton.png",
    description:
      "Выводит таймер до конца трансляции. Донаты увеличивают время таймера. Подходит для донатофонов",
    create: () => new DonatonWidgetSettings(),
  },
  {
    name: "reel",
    title: "Рулетка",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "",
    description:
      "Позволяет создать рулетку с призами. За поддержку рулетка будет прокручиваться, рандомно выбирая слоты",
    create: () => new ReelWidgetSettings(),
  },
  {
    name: "player-popup",
    title: "Видео из медиаплеера",
    icon: <AlertsIcon/>,
    category: "media",
    preview: "https://api.oda.digital/assets/popup.png",
    description: "Показывает видео из заказанных медиа в медиаплеере",
    create: () => {
      return new PlayerPopupWidgetSettings();
    },
  },
  {
    name: "rutonychat",
    title: "Rutony Chat Integration",
    icon: <AlertsIcon/>,
    category: "internal",
    preview: "",
    description: "Rutony Chat Integration",
    create: () => new RutonyChatSettings(),
  },
  {
    name: "player-control",
    title: "Пульт от медиаплеера",
    icon: <AlertsIcon/>,
    category: "media",
    preview: "",
    description: "Позволяет удалённо управлять медиаплеером",
    create: () => new PlayerControlWidgetSettings(),
  },
  {
    name: "horizontal-events",
    title: "Горизонтальная лента событий",
    icon: <AlertsIcon/>,
    category: "onscreen",
    preview: "",
    description:
      "Бегущая строка, показывающая последние события (донаты в текущий момент)",
    create: () => new HorizontalEventsWidgetSettings(),
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
    makeObservable<Widget, "_name" | "_config">(this, {
      _name: observable,
      _config: observable,
      reload: action,
    });
  }

  public static createDefault(
    type: string,
  ): AbstractWidgetSettings | undefined {
    return WIDGET_TYPES.find((t) => t.name === type)?.create();
  }

  public static configFromJson(json: any): AbstractWidgetSettings | null {
    return this.config(json.type, json.config.properties);
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
  public get subactions(): ReactNode {
    return this._config.subactions();
  }
}
