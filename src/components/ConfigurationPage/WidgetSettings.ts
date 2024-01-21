const defaultSettings = {
  "donaters-top-list": {
    properties: [
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
        displayName: "Шрифт",
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
        displayName: "Размер шрифта",
      },
      {
        name: "titleColor",
        type: "color",
        value: "#ffffff",
        displayName: "Цвет заголовка",
      },
      {
        name: "color",
        type: "color",
        value: "#ffffff",
        displayName: "Цвет",
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
    ],
  },
  "donation-timer": {
    properties: [
      {
        name: "resetOnLoad",
        type: "custom",
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
  },
  media: {
    properties: [
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
  },
  "player-control": {
    properties: [],
  },
  "player-popup": {
    properties: [],
  },
  payments: {
    properties: [
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
  },
  "payment-alerts": {
    properties: [
      {
        name: "useGreenscreen",
        type: "boolean",
        value: false,
        displayName: "Использовать greenscreen"
      },
    ],
    alerts: [],
  },
  "player-info": {
    properties: [
      {
        name: "font",
        type: "fontselect",
        value: "Roboto",
        displayName: "Шрифт",
      },
      {
        name: "fontSize",
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
  },
};

interface WidgetProperties {
  name: string;
  type: string;
  value: string;
  displayName: string;
  tab?: string;
}

class WidgetSettings {
  properties: WidgetProperties[];
	type: string;

  constructor(type:string, properties: WidgetProperties[]) {
    this.properties = properties;
		this.type = type;
  }

  findSetting(key: string) {
    const setting = this.properties.find((prop) => key === prop.name);
    if (setting) {
      return setting.value;
    }
    return defaultSettings[this.type].properties.find((prop: WidgetProperties) => key === prop.name);
  }
}

export { defaultSettings, WidgetSettings };
