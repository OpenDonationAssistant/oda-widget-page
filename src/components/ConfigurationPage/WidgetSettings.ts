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

  constructor(properties: WidgetProperty[], defaultValues: WidgetProperty[]) {
    this._properties = properties;
    this._defaultValues = defaultValues;
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
    this._properties = value;
  }

  public get defaultValues(): WidgetProperty[] {
    return structuredClone(this._defaultValues);
  }
}

class DonatersTopListWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
      {
        name: "type",
        type: "custom",
        value: "All",
        displayName: "Тип виджета",
      },
      {
        name: "period",
        type: "custom",
        value: "month",
        displayName: "Период",
      },
      {
        name: "topsize",
        type: "number",
        value: "3",
        displayName: "Кол-во донатеров",
      },
      {
        name: "title",
        type: "text",
        value: "Донатеры",
        displayName: "Заголовок",
      },
      {
        name: "titleFont",
        type: "fontselect",
        value: "Roboto",
        displayName: "Шрифт заголовка",
      },
      {
        name: "font",
        type: "fontselect",
        value: "Roboto",
        displayName: "Шрифт списка",
      },
      {
        name: "titleFontSize",
        type: "number",
        value: "24",
        displayName: "Размер шрифта заголовка",
      },
      {
        name: "fontSize",
        type: "number",
        value: "24",
        displayName: "Размер шрифта списка",
      },
      {
        name: "titleColor",
        type: "color",
        value: "#ffffff",
        displayName: "Цвет заголовка",
      },
      {
        name: "titleBackgroundColor",
        type: "color",
        value: "#000000",
        displayName: "Цвет фона заголовка",
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
      },
      {
        name: "titleAlphaChannel",
        type: "number",
        value: "1.0",
        displayName: "Прозрачность заголовка",
      },
      {
        name: "alphaChannel",
        type: "number",
        value: "1.0",
        displayName: "Прозрачность списка",
      },
      {
        name: "layout",
        type: "custom",
        value: "vertical",
        displayName: "Компоновка",
      },
    ]);
  }
}

class EmptyWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, []);
  }
}

class DonationTimerWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
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
    ]);
  }
}

class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
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
    ]);
  }
}

class PlayerPopupWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
      {
        name: "audioOnly",
        type: "boolean",
        value: false,
        displayName: "Воспроизводить только звук",
      },
    ]);
  }
}

class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
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
    ]);
  }
}

class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  alerts: any[];
  constructor(properties: WidgetProperty[], alerts: any[]) {
    super(properties, [
      {
        name: "useGreenscreen",
        type: "boolean",
        value: false,
        displayName: "Использовать greenscreen",
      },
    ]);
    this.alerts = alerts;
  }
}

class PlayerInfoWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
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
    ]);
  }
}

class ReelWidgetSettings extends AbstractWidgetSettings {
  constructor(properties: WidgetProperty[]) {
    super(properties, [
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
    ]);
  }
}

const defaultSettings = {
  "donaters-top-list": new DonatersTopListWidgetSettings([]),
  "donation-timer": new DonationTimerWidgetSettings([]),
  media: new MediaWidgetSettings([]),
  "player-control": new EmptyWidgetSettings([]),
  "player-popup": new PlayerPopupWidgetSettings([]),
  payments: new PaymentsWidgetSettings([]),
  "payment-alerts": new PaymentAlertsWidgetSettings([], []),
  "player-info": new PlayerInfoWidgetSettings([]),
  reel: new ReelWidgetSettings([]),
};

export {
  defaultSettings,
  WidgetSettings,
  WidgetProperty,
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
