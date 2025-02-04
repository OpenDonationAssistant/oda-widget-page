import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { ColorProperty, ColorPropertyTarget, GRADIENT_TYPE } from "../../widgetproperties/ColorProperty";
import { HeightProperty } from "../../widgetproperties/HeightProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { SELECTION_TYPE, SingleChoiceProperty } from "../../widgetproperties/SingleChoiceProperty";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";

export const DEFAULT_PROPERTIES = [
    new DefaultWidgetProperty({
      name: "name",
      value: null,
    }),
    new DefaultWidgetProperty({
      name: "imageWidth",
      value: null,
    }),
    new DefaultWidgetProperty({
      name: "imageHeight",
      value: null,
    }),
    new DefaultWidgetProperty({
      name: "imageShowTime",
      value: null,
    }),
    new DefaultWidgetProperty({
      name: "appearance",
      value: "none",
    }),
    new DefaultWidgetProperty({
      name: "audio-volume",
      value: 50,
    }),
    new DefaultWidgetProperty({
      name: "headerFont",
      value: null,
    }),
    new DefaultWidgetProperty({
      name: "nicknameTextTemplate",
      value: "<username> - <amount>",
    }),
    new DefaultWidgetProperty({
      name: "font",
      value: null
    }),
    new DefaultWidgetProperty({
      name: "appearance",
      value: "none",
    }),
    new DefaultWidgetProperty({
      name: "enableVoiceForHeader",
      value: true,
    }),
    new DefaultWidgetProperty({
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
    new DefaultWidgetProperty({
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
    new DefaultWidgetProperty({
      name: "message-appearance",
      value: "none",
    }),
    new DefaultWidgetProperty({
      name: "enableVoiceForMessage",
      value: true,
    }),
    new BorderProperty({ name: "imageBorder"}),
    new RoundingProperty({ name: "imageRounding"}),
    new PaddingProperty({ name: "imagePadding"}),
    new BoxShadowProperty({ name: "imageShadow"}),
    new BooleanProperty({
      name: "showHeader",
      value: true,
      displayName: "widget-donaterslist-show-header",
    }),
    new WidthProperty({ name: "headerWidth" }),
    new HeightProperty({ name: "headerHeight" }),
    new SingleChoiceProperty({
      name: "headerAlignment",
      value: "Center",
      displayName: "widget-donaterslist-list-alignment",
      options: ["Left", "Center", "Right"],
      selectionType: SELECTION_TYPE.SEGMENTED,
    }),
    new ColorProperty({
        name: "titleBackgroundColor",
        displayName: "widget-donaterslist-title-background-color",
        value: {
          gradient: false,
          gradientType: GRADIENT_TYPE.LINEAR,
          repeating: false,
          colors: [{ color: "rgba(0,0,0,0)" }],
          angle: 0,
        },
        target: ColorPropertyTarget.BACKGROUND,
    }),
    new BackgroundImageProperty({
        name: "headerBackgroundImage",
    }),
    new BorderProperty({
        name: "headerBorder",
    }),
    new RoundingProperty({
      name: "headerRounding",
    }),
    new PaddingProperty({
      name: "headerPadding",
    }),
    new BoxShadowProperty({
      name: "headerBoxShadow",
    }),
    new BooleanProperty({
      name: "showMessage",
      value: true,
      displayName: "widget-donaterslist-show-message",
    }),
    new WidthProperty({ name: "messageWidth" }),
    new HeightProperty({ name: "messageHeight" }),
    new SingleChoiceProperty({
      name: "messageAlignment",
      value: "Center",
      displayName: "widget-donaterslist-list-alignment",
      options: ["Left", "Center", "Right"],
      selectionType: SELECTION_TYPE.SEGMENTED,
    }),
    new ColorProperty({
        name: "messageBackgroundColor",
        displayName: "widget-donaterslist-title-background-color",
        value: {
          gradient: false,
          gradientType: GRADIENT_TYPE.LINEAR,
          repeating: false,
          colors: [{ color: "rgba(0,0,0,0)" }],
          angle: 0,
        },
        target: ColorPropertyTarget.BACKGROUND,
    }),
    new BackgroundImageProperty({
        name: "messageBackgroundImage",
    }),
    new BorderProperty({
        name: "messageBorder",
    }),
    new RoundingProperty({
      name: "messageRounding",
    }),
    new PaddingProperty({
      name: "messagePadding",
    }),
    new BoxShadowProperty({
      name: "messageBoxShadow",
    })
]
