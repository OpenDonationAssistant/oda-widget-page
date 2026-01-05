import { ElementFactory } from "../../../Element/ElementFactory";
import { ElementsProperty } from "../../../Element/ElementsProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { TextProperty } from "../../widgetproperties/TextProperty";
import { VolumeProperty } from "../../widgetproperties/VolumeProperty";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { Alert } from "./Alerts";
import { DurationProperty } from "./DurationProperty";

export const DEFAULT_PROPERTIES = (alert: Alert) => [
  new DefaultWidgetProperty({
    name: "name",
    value: "<Без названия>",
  }),
  new DefaultWidgetProperty({
    name: "enabled",
    value: true,
  }),
  new DurationProperty({
    name: "duration",
  }),
  new ElementsProperty({
    value: [],
    available: ElementFactory.list()
  }),
  new NumberProperty({
    name: "audioDelay",
    value: 0,
    displayName: "Задержка аудио",
    addon: "ms",
  }),
  new VolumeProperty({
    name: "audio-volume",
  }),
  new DefaultWidgetProperty({
    name: "enableVoiceForHeader",
    value: true,
  }),
  new NumberProperty({
    name: "headerVoiceDelay",
    value: 0,
    displayName: "Задержка озвучки заголовка",
    addon: "ms",
  }),
  new TextProperty({
    displayName: "Фразы для озвучивания заголовка с сообщением",
    name: "voiceTextTemplate",
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
  }),
  new DefaultWidgetProperty({
    name: "enableVoiceWhenMessageIsEmpty",
    value: true,
  }),
  new TextProperty({
    displayName: "Фразы для озвучивания заголовка если нет сообщения",
    name: "voiceEmptyTextTemplates",
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
  }),
  new NumberProperty({
    name: "messageVoiceDelay",
    value: 0,
    displayName: "Задержка озвучки сообщения",
    addon: "ms",
  }),
  new DefaultWidgetProperty({
    name: "enableVoiceForMessage",
    value: true,
  }),
  new VolumeProperty({
    name: "voiceVolume",
  }),
];
