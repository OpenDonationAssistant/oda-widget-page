import { ReactNode } from "react";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";
import { BooleanProperty } from "../widgetproperties/BooleanProperty";
import { TextProperty } from "../widgetproperties/TextProperty";
import { Flex } from "antd";
import { CloseOverlayButton } from "../../Overlay/Overlay";

export class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new BooleanProperty({
              name: "requestsEnabled",
              value: true,
              displayName: "Реквесты включены",
            }),
            new NumberProperty({
              name: "songRequestCost",
              value: 100,
              addon: "руб",
              displayName: "Стоимость одного видео",
            }),
            new NumberProperty({
              name: "songMaxAmount",
              value: 12,
              displayName: "Максимальное кол-во видео в одном донате",
            }),
            new NumberProperty({
              name: "requestViewAmount",
              value: 100,
              displayName: "Минимальное кол-во просмотров",
            }),
            new BooleanProperty({
              name: "youtubeEnabled",
              value: true,
              displayName: "Реквесты с YouTube",
            }),
            new BooleanProperty({
              name: "vkvideoEnabled",
              value: true,
              displayName: "Реквесты с VKVideo",
            }),
            new TextProperty({
              name: "requestTooltip",
              value: "",
              displayName: "Текст подсказки для донатера",
            }),
            new TextProperty({
              name: "wordsBlacklist",
              value: "",
              displayName: "Blacklist слов в названии",
            }),
          ],
        },
        {
          key: "appearance",
          title: "Внешний вид",
          properties: [
            new NumberProperty({
              name: "playlistSongTitleFontSize",
              value: 16,
              addon: "px",
              displayName: "widget-media-title-font-size",
            }),
            new NumberProperty({
              name: "playlistNicknameFontSize",
              value: 16,
              addon: "px",
              displayName: "widget-media-customer-font-size",
            }),
          ],
        },
      ],
    });
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="top" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Плеер"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Проигрывает видео из реквеста из доната.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Плеер) скопировать ссылку</li>
            <li>
              Скопированную ссылку можно вставить как Dock в OBS либо открыть в
              браузере. В обоих случаях плеер будет принимать реквесты,
              проигрывать их.
            </li>
            <li>
              Чтобы уточнить цену реквестов и отобразить поле для их добавления,
              надо в разделе 'Страница доната' выставить поле 'Реквесты
              музыки/видео' в Enabled и прописать их стоимость в поле 'Стоимость
              реквестов'.
            </li>
          </ul>
        </div>
        <h3 className={`${classes.helptitle}`}>FAQ</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>
              Если подключен виджет алертов, плеер будет включать паузу на время
              алерта.
            </li>
            <li>
              Внутри виджета 'Плеер' можно включать/выключать реквесты - в меню
              кнопка 'Disable requests'.
            </li>
            <li>
              Если запущено несколько копий плеера, то реквесты будут попадать
              рандомно в один из них.
            </li>
            <li>
              С помощью виджета 'Remote Control' можно управлять плеером
              дистанционно (например модератору).
            </li>
          </ul>
        </div>
      </>
    );
  }
}
