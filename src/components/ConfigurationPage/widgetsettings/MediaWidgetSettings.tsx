import { ReactNode } from "react";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";
import classes from "./AbstractWidgetSettings.module.css";

export class MediaWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
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
        <h3 className={`${classes.helptitle}`}>Виджет "Плеер"</h3>
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
