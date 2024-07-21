import { log } from "../../../logging";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

const DEFAULT_ALERT = {
  audio: null,
  image: null,
  video: null,
  trigger: {
    amount: 10,
  },
  properties: [
    {
      tab: "image",
      name: "imageWidth",
      value: null,
      displayName: "Ширина изображения в пикселях",
    },
    {
      tab: "image",
      name: "imageHeight",
      value: null,
      displayName: "Высота изображения в пикселях",
    },
    {
      tab: "image",
      name: "imageShowTime",
      value: null,
      displayName: "Сколько времени показывать изображение (сек)",
    },
    {
      tab: "header",
      name: "nicknameFont",
      type: "fontselect",
      value: "Roboto",
      displayName: "Шрифт в заголовке",
    },
    {
      tab: "header",
      name: "nicknameFontSize",
      value: "60",
      displayName: "Размер шрифта в заголовке",
    },
    {
      tab: "header",
      name: "headerColor",
      type: "color",
      value: "#fb8c2b",
      displayName: "Цвет заголовка",
    },
    {
      tab: "header",
      name: "nicknameTextTemplate",
      type: "text",
      value: "<username> - <amount>",
      displayName: "Шаблон заголовка",
    },
    {
      tab: "message",
      name: "messageFont",
      type: "fontselect",
      value: "Roboto",
      displayName: "Шрифт в сообщении",
    },
    {
      tab: "message",
      name: "messageFontSize",
      value: "25",
      displayName: "Размер шрифта в сообщении",
    },
    {
      tab: "message",
      name: "messageColor",
      type: "color",
      value: "#ffffff",
      displayName: "Цвет сообщения",
    },
    {
      tab: "voice",
      name: "voiceTextTemplate",
      type: "text",
      value: `Пользователь <username> оставил сообщение
<amount> рублей пожертвовал добрый человек по имени <username> с фразой
Щедрый донат в <amount> рублей от <username> со словами
Стример стал богаче на <amount> рублей благодаря <username>
Перевод на <amount> рублей стримеру <streamer> от <username>
Некто <username> сделал подарок в размере <amount> рублей
<streamer> теперь может покушать благодаря <username> и <amount> рублям
<amount> рублей перекочевали в карман <streamer>, спасибо <username>
Донат от <username> в размере <amount> рублей
Низкий поклон <username> за <amount> рублей
Броадкастер <streamer> теперь будет счастливее благодаря <amount> рублям от <username>
Спасибо <username> за целых <amount> рублей, это так неожиданно и приятно
Спасибо <username> за <amount> рублей
Пользователь <username> поддержал стримера <amount> рублями
Пользователь <username> пожертвовал <amount> рублей
Поддержка стримера в размере <amount> рублей от <username>
Стримеру упала денюжка от <username>
Для <streamer> на развитие канала донат <amount> рублей от <username>
Пожертвование на развитие и поддержку канала <streamer> в размере <amount> рублей от <username>
Плюс <amount> от <username>
Донат <minoramount> <break time=\"1s\"/> копеек от <username>
<username> закинул <amount>
Еще <amount> рублей от <username>
Пользователь <username> поддержал стримера, предоставив ему 100 рублей
<username> оказывает помощь стримеру в размере <amount> рублей
Пользователь <username> произвел безвозмедное дарение <amount> рублей
<amount> рублей в помощь от <username>
Некоторую значительную сумму подарил пользователь <username>
Определенное количество рублей подарено щедрым пользователем <username>
<amount> рублей от <username>, премного благодарны
Плюс-минус <amount> рублей донатом от <username>
<streamer> сможет продолжать стримить благодаря <amount> рублям от <username>
Осуществлен перевод на сумму <amount> от <username> в пользу стримера <streamer>
Пользователь всемирной сети Интернет, известный как <username>, поддержал стримера денежным переводом в размере <amount> рублей
Очень рады <username> и <amount> рублям`,
      displayName: "Фразы для озвучивания заголовка с сообщением",
    },
    {
      tab: "voice",
      name: "enableVoiceWhenMessageIsEmpty",
      type: "boolean",
      value: true,
      displayName: "Озвучивать заголовок если сообщение отсутствует",
    },
    {
      tab: "voice",
      name: "voiceEmptyTextTemplates",
      type: "text",
      value: `Пользователь <username> оставил сообщение
<amount> рублей пожертвовал добрый человек по имени <username>
Щедрый донат в <amount> рублей от <username>
Стример стал богаче на <amount> рублей благодаря <username>
Перевод на <amount> рублей стримеру <streamer> от <username>
Некто <username> сделал подарок в размере <amount> рублей
<streamer> теперь может покушать благодаря <username> и <amount> рублям
<amount> рублей перекочевали в карман <streamer>, спасибо <username>
Донат от <username> в размере <amount> рублей
Низкий поклон <username> за <amount> рублей
Броадкастер <streamer> теперь будет счастливее благодаря <amount> рублям от <username>
Спасибо <username> за целых <amount> рублей, это так неожиданно и приятно
Спасибо <username> за <amount> рублей
Пользователь <username> поддержал стримера <amount> рублями
Пользователь <username> пожертвовал <amount> рублей
Поддержка стримера в размере <amount> рублей от <username>
Стримеру упала денюжка от <username>
Для <streamer> на развитие канала донат <amount> рублей от <username>
Пожертвование на развитие и поддержку канала <streamer> в размере <amount> рублей от <username>
Плюс <amount> от <username>
Донат <minoramount> <break time=\"1s\"/> копеек от <username>
<username> закинул <amount>
Еще <amount> рублей от <username>
Пользователь <username> поддержал стримера, предоставив ему 100 рублей
<username> оказывает помощь стримеру в размере <amount> рублей
Пользователь <username> произвел безвозмедное дарение <amount> рублей
<amount> рублей в помощь от <username>
Некоторую значительную сумму подарил пользователь <username>
Определенное количество рублей подарено щедрым пользователем <username>
<amount> рублей от <username>, премного благодарны
Плюс-минус <amount> рублей донатом от <username>
<streamer> сможет продолжать стримить благодаря <amount> рублям от <username>
Осуществлен перевод на сумму <amount> от <username> в пользу стримера <streamer>
Пользователь всемирной сети Интернет, известный как <username>, поддержал стримера денежным переводом в размере <amount> рублей
Очень рады <username> и <amount> рублям`,
      displayName: "Фразы для озвучивания заголовка если нет сообщения",
    },
  ],
};

export class PaymentAlertsWidgetSettings extends AbstractWidgetSettings {
  public alerts: any[];
  private _defaultAlert: any;

  constructor(
    widgetId: string,
    properties: WidgetProperty[],
    alerts: any[],
    defaultAlert?: any,
  ) {
    log.debug({ alerts: alerts }, `creating payment-alerts settings`);
    super(
      widgetId,
      properties,
      [
        new BooleanProperty(
          widgetId,
          "useGreenscreen",
          "boolean",
          false,
          "widget-alert-use-greenscreen",
        ),
      ],
      new Map(),
    );
    this.alerts = alerts;
    this._defaultAlert = defaultAlert ??  DEFAULT_ALERT;
  }

  public copy() {
    return new PaymentAlertsWidgetSettings(
      this.widgetId,
      this.properties,
      this.alerts,
      this._defaultAlert,
    );
  }
  public get defaultAlert(): any {
    return this._defaultAlert;
  }
  public set defaultAlert(value: any) {
    this._defaultAlert = value;
  }
}
