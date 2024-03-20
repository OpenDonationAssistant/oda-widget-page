import { log } from "../../logging";

interface WidgetProperty {
  name: string;
  type: string;
  value: any;
  displayName: string;
  tab?: string;
}

interface WidgetSettings {
  get(key: string): WidgetProperty | undefined;
}

class AbstractWidgetSettings {
  private _properties: WidgetProperty[];
  private _defaultValues: WidgetProperty[];
  private _tabDescriptions: Map<string, string>;

  constructor(
    properties: WidgetProperty[],
    defaultValues: WidgetProperty[],
    tabDescriptions: Map<string, string>,
  ) {
    this._defaultValues = defaultValues;
    this._properties = this.mergeProperties(properties);
    this._tabDescriptions = tabDescriptions;
  }

  private mergeProperties(value: WidgetProperty[]): WidgetProperty[] {
    const prepared = structuredClone(this._defaultValues);
    const updated =  prepared.map((prop) => {
      const updated = structuredClone(prop);
      updated.value = value.find((it) => it.name === prop.name)?.value ?? updated.value;
      return updated;
    });
    log.debug(
      `merged properties on DonatersTopListWidgetSettings: ${JSON.stringify(
        updated,
      )}`,
    );
    return updated;
  }

  set(key: string, value: any) {
    this._properties.map((prop) => {
      if (prop.name === key) {
        const updated = structuredClone(prop);
        updated.value = value;
        return updated;
      }
      return prop;
    });
  }

  get(key: string): WidgetProperty | undefined {
    const setting = this.properties.find((prop) => key === prop.name);
    if (setting) {
      return setting.value;
    }
    return this._defaultValues.find((prop) => key === prop.name);
  }

  public get properties(): WidgetProperty[] {
    return this._properties;
  }

  public set properties(value: WidgetProperty[]) {
    this._properties = this.mergeProperties(value);
  }

  public get defaultValues(): WidgetProperty[] {
    return structuredClone(this._defaultValues);
  }

  public get tabDescriptions(): Map<string, string> {
    return this._tabDescriptions;
  }

  public set tabDescriptions(value: Map<string, string>) {
    this._tabDescriptions = value;
  }

  public copy() {
    return new AbstractWidgetSettings(
      this.properties,
      this.defaultValues,
      this.tabDescriptions,
    );
  }
}

class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    const tabs = new Map();
    tabs.set("content", "Содержимое");
    tabs.set("header", "Заголовок");
    tabs.set("list", "Список");
    super(
      properties,
      [
        {
          name: "type",
          type: "custom",
          value: "All",
          displayName: "Тип виджета",
          tab: "content",
        },
        {
          name: "period",
          type: "custom",
          value: "month",
          displayName: "Период",
          tab: "content",
        },
        {
          name: "topsize",
          type: "number",
          value: "3",
          displayName: "Кол-во донатеров",
          tab: "content",
        },
        {
          name: "title",
          type: "text",
          value: "Донатеры",
          displayName: "Заголовок",
          tab: "header",
        },
        {
          name: "titleFont",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт заголовка",
          tab: "header",
        },
        {
          name: "font",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт списка",
          tab: "list",
        },
        {
          name: "titleFontSize",
          type: "number",
          value: "24",
          displayName: "Размер шрифта заголовка",
          tab: "header",
        },
        {
          name: "fontSize",
          type: "number",
          value: "24",
          displayName: "Размер шрифта списка",
          tab: "list",
        },
        {
          name: "titleColor",
          type: "color",
          value: "#ffffff",
          displayName: "Цвет заголовка",
          tab: "header",
        },
        {
          name: "titleBackgroundColor",
          type: "color",
          value: "#000000",
          displayName: "Цвет фона заголовка",
          tab: "header",
        },
        {
          name: "color",
          type: "color",
          value: "#ffffff",
          displayName: "Цвет списка",
        },
        {
          name: "backgroundColor",
          type: "color",
          value: "#000000",
          displayName: "Цвет фона списка",
          tab: "list",
        },
        {
          name: "titleAlphaChannel",
          type: "number",
          value: "1.0",
          displayName: "Прозрачность заголовка",
          tab: "header",
        },
        {
          name: "alphaChannel",
          type: "number",
          value: "1.0",
          displayName: "Прозрачность списка",
          tab: "list",
        },
        {
          name: "layout",
          type: "custom",
          value: "vertical",
          displayName: "Компоновка",
          tab: "content",
        },
      ],
      tabs,
    );
  }

  public copy() {
    return new DonatersTopListWidgetSettings(this.properties);
  }
}

class EmptyWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [], new Map());
  }
}

class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "resetOnLoad",
          type: "boolean",
          value: true,
          displayName: "Обнулять таймер при открытии",
        },
        {
          name: "font",
          type: "fontselect",
          value: "Andika",
          displayName: "Шрифт",
        },
        {
          name: "fontSize",
          type: "string",
          value: "24",
          displayName: "Размер шрифта",
        },
        {
          name: "color",
          type: "color",
          value: "#ffffff",
          displayName: "Цвет",
        },
        {
          name: "text",
          type: "text",
          value: "Без донатов уже <time>",
          displayName: "Текст",
        },
      ],
      new Map(),
    );
  }
}

class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "playlistSongTitleFontSize",
          type: "string",
          value: "16",
          displayName: "Размер шрифта в названии песни в плейлисте",
        },
        {
          name: "playlistNicknameFontSize",
          type: "string",
          value: "16",
          displayName: "Размер шрифта в имени заказчика в плейлисте",
        },
      ],
      new Map(),
    );
  }
}

class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "audioOnly",
          type: "boolean",
          value: false,
          displayName: "Воспроизводить только звук",
        },
      ],
      new Map(),
    );
  }
}

class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "nicknameFontSize",
          type: "string",
          value: "28",
          displayName: "Размер шрифта в имени донатера",
        },
        {
          name: "messageFontSize",
          type: "string",
          value: "19",
          displayName: "Размер шрифта в сообщении",
        },
      ],
      new Map(),
    );
  }
}

class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  public alerts: any[];
  constructor(properties: WidgetProperty[], alerts: any[]) {
    log.debug({ alerts: alerts}, `creating payment-alerts settings`);
    super(
      properties,
      [
        {
          name: "useGreenscreen",
          type: "boolean",
          value: false,
          displayName: "Использовать greenscreen",
        },
      ],
      new Map(),
    );
    this.alerts = alerts;
  }
  public copy() {
    return new PaymentAlertsWidgetSettings(
      this.properties,
      this.alerts
    );
  }
}

class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "font",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт",
        },
        {
          name: "fontSize",
          type: "number",
          value: "24",
          displayName: "Размер шрифта",
        },
        {
          name: "color",
          type: "color",
          value: "#ffffff",
          displayName: "Цвет",
        },
      ],
      new Map(),
    );
  }
}

class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(
      properties,
      [
        {
          name: "font",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт",
        },
        {
          name: "fontSize",
          type: "number",
          value: "24",
          displayName: "Размер шрифта",
        },
        {
          name: "color",
          type: "color",
          value: "#000000",
          displayName: "Цвет текста",
        },
        {
          name: "borderColor",
          type: "color",
          value: "#FF0000",
          displayName: "Цвет рамок",
        },
        {
          name: "selectionColor",
          type: "color",
          value: "#00FF00",
          displayName: "Фон выбора",
        },
        {
          name: "type",
          type: "custom",
          value: "eachpayment",
          displayName: "Условие",
        },
        {
          name: "requiredAmount",
          type: "number",
          value: "100",
          displayName: "Требуемая сумма",
        },
        {
          name: "optionList",
          type: "custom",
          value: ["Ничего", "Выигрыш"],
          displayName: "Призы",
        },
      ],
      new Map(),
    );
  }
}

const defaultSettings = new Map<string, AbstractWidgetSettings>();
defaultSettings.set("donaters-top-list", new DonatersTopListWidgetSettings([]));
defaultSettings.set("donation-timer", new DonationTimerWidgetSettings([]));
defaultSettings.set("media", new MediaWidgetSettings([]));
defaultSettings.set("player-control", new EmptyWidgetSettings([]));
defaultSettings.set("player-popup", new PlayerPopupWidgetSettings([]));
defaultSettings.set("payments", new PaymentsWidgetSettings([]));
defaultSettings.set("payment-alerts", new PaymentAlertsWidgetSettings([], []));
defaultSettings.set("player-info", new PlayerInfoWidgetSettings([]));
defaultSettings.set("reel", new ReelWidgetSettings([]));

export {
  defaultSettings,
  WidgetSettings,
  WidgetProperty,
  AbstractWidgetSettings,
  DonatersTopListWidgetSettings,
  DonationTimerWidgetSettings,
  MediaWidgetSettings,
  EmptyWidgetSettings,
  PlayerPopupWidgetSettings,
  PaymentsWidgetSettings,
  PaymentAlertsWidgetSettings,
  PlayerInfoWidgetSettings,
  ReelWidgetSettings,
};
