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
        type: "string",
        value: "3",
        displayName: "Кол-во в топе",
      },
      {
        name: "font",
        type: "fontselect",
        value: "Roboto",
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
    properties: [],
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
