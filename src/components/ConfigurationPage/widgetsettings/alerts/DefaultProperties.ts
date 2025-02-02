import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { ColorProperty, ColorPropertyTarget, GRADIENT_TYPE } from "../../widgetproperties/ColorProperty";
import { HeightProperty } from "../../widgetproperties/HeightProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { SELECTION_TYPE, SingleChoiceProperty } from "../../widgetproperties/SingleChoiceProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";

export const DEFAULT_PROPERTIES = [
    { name: "name", value: null },
    {
      name: "imageWidth",
      value: null,
    },
    {
      name: "imageHeight",
      value: null,
    },
    {
      name: "imageShowTime",
      value: null,
    },
    {
      name: "appearance",
      value: "none",
    },
    {
      name: "audio-volume",
      value: 50,
    },
    {
      name: "headerFont",
      value: null,
    },
    {
      name: "nicknameTextTemplate",
      value: "<username> - <amount>",
    },
    {
      name: "font",
      value: null,
    },
    {
      name: "appearance",
      value: "none",
    },
    {
      name: "enableVoiceForHeader",
      value: true,
    },
    {
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
    },
    {
      name: "enableVoiceWhenMessageIsEmpty",
      value: true,
    },
    {
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
    },
    {
      name: "message-appearance",
      value: "none",
    },
    {
      name: "enableVoiceForMessage",
      value: true,
    },
    {
      name: "imageBorder",
      value: new BorderProperty({ name: "imageBorder"})
    },
    {
      name: "imageRounding",
      value: new RoundingProperty({ name: "imageRounding"})
    },
    {
      name: "imagePadding",
      value: new PaddingProperty({ name: "imagePadding"})
    },
    {
      name: "imageShadow",
      value: new BoxShadowProperty({ name: "imageShadow"})
    },
    {
      name: "showHeader",
      value: new BooleanProperty({
        name: "showHeader",
        value: true,
        displayName: "widget-donaterslist-show-header",
      }),
    },
    {
      name: "headerWidth",
      value: new WidthProperty({ name: "headerWidth" }),
    },
    {
      name: "headerHeight",
      value: new HeightProperty({ name: "headerHeight" }),
    },
    {
      name: "headerAlignment",
      value: new SingleChoiceProperty({
          name: "headerAlignment",
          value: "Center",
          displayName: "widget-donaterslist-list-alignment",
          options: ["Left", "Center", "Right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        })
    },
    {
      name: "headerBackgroundColor",
      value: new ColorProperty({
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
      })
    },
    {
      name: "headerBackgroundImage",
      value: new BackgroundImageProperty({
          name: "headerBackgroundImage",
      })
    },
    {
      name: "headerBorder",
      value: new BorderProperty({
          name: "headerBorder",
      })
    },
    {
      name: "headerRounding",
      value:         new RoundingProperty({
          name: "headerRounding",
        }),
    },
    {
      name: "headerPadding",
      value: new PaddingProperty({
        name: "headerPadding",
      })
    },
    {
      name: "headerBoxShadow",
      value: new BoxShadowProperty({
        name: "headerBoxShadow",
      }),
    },
    {
      name: "showMessage",
      value: new BooleanProperty({
        name: "showMessage",
        value: true,
        displayName: "widget-donaterslist-show-message",
      }),
    },
    {
      name: "messageWidth",
      value: new WidthProperty({ name: "messageWidth" }),
    },
    {
      name: "messageHeight",
      value: new HeightProperty({ name: "messageHeight" }),
    },
    {
      name: "messageAlignment",
      value: new SingleChoiceProperty({
          name: "messageAlignment",
          value: "Center",
          displayName: "widget-donaterslist-list-alignment",
          options: ["Left", "Center", "Right"],
          selectionType: SELECTION_TYPE.SEGMENTED,
        })
    },
    {
      name: "messageBackgroundColor",
      value: new ColorProperty({
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
      })
    },
    {
      name: "messageBackgroundImage",
      value: new BackgroundImageProperty({
          name: "messageBackgroundImage",
      })
    },
    {
      name: "messageBorder",
      value: new BorderProperty({
          name: "messageBorder",
      })
    },
    {
      name: "messageRounding",
      value:         new RoundingProperty({
          name: "messageRounding",
        }),
    },
    {
      name: "messagePadding",
      value: new PaddingProperty({
        name: "messagePadding",
      })
    },
    {
      name: "messageBoxShadow",
      value: new BoxShadowProperty({
        name: "messageBoxShadow",
      }),
    }
]
