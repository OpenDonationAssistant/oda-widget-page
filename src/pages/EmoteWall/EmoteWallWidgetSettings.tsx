import { ReactNode } from "react";
import { Flex } from "antd";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { EmoteWallWidget } from "./EmoteWallWidget";
import { DemoEmoteWallWidgetStore } from "./EmoteWallWidgetStore";

export class EmoteWallWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "widget",
          title: "Весь виджет",
          properties: [
            new WidthProperty({
              name: "width",
              displayName: "Ширина",
            }),
            new HeightProperty({
              name: "height",
              displayName: "Высота",
            }),
          ],
        },
        {
          key: "emotes",
          title: "Эмоции",
          properties: [
            new NumberProperty({
              name: "emoteSize",
              value: 64,
              addon: "px",
              displayName: "Размер эмоций",
            }),
            new NumberProperty({
              name: "animationDuration",
              value: 4000,
              addon: "ms",
              displayName: "Длительность анимации",
            }),
            new NumberProperty({
              name: "maxConcurrentEmotes",
              value: 30,
              displayName: "Максимум эмоций на экране",
            }),
          ],
        },
      ],
    });
  }

  public get widthProperty(): WidthProperty {
    return this.get("width") as WidthProperty;
  }

  public get heightProperty(): HeightProperty {
    return this.get("height") as HeightProperty;
  }

  public get emoteSizeProperty(): NumberProperty {
    return this.get("emoteSize") as NumberProperty;
  }

  public get animationDurationProperty(): NumberProperty {
    return this.get("animationDuration") as NumberProperty;
  }

  public get maxConcurrentEmotesProperty(): NumberProperty {
    return this.get("maxConcurrentEmotes") as NumberProperty;
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Стена эмоций"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Виджет для отображения летящих эмоций из чата поверх стрима.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Стена эмоций) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    return (
      <EmoteWallWidget
        store={
          new DemoEmoteWallWidgetStore({
            maxConcurrentEmotes: this.maxConcurrentEmotesProperty.value,
            animationDuration: this.animationDurationProperty.value,
          })
        }
        settings={this}
      />
    );
  }
}