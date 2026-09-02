import { Flex } from "antd";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { ReactNode } from "react";
import classes from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings.module.css";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { CustomWidget } from "./CustomWidget";
import { SourcesProperty } from "./SourcesProperty";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { downloadFile } from "../../utils";
import { DemoCustomWidgetStore } from "./CustomWidgetStore";

export class CustomWidgetSettings extends AbstractWidgetSettings {
  private _sources: SourcesProperty = new SourcesProperty({
    name: "sources",
    displayName: "Файлы",
  });
  private _width: WidthProperty = new WidthProperty({
    name: "width",
    displayName: "Ширина",
  });
  private _height: HeightProperty = new HeightProperty({
    name: "height",
    displayName: "Высота",
  });
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "style",
      title: "Общее",
      properties: [this._width, this._height, this._sources],
    });
  }

  public get widthProperty(): WidthProperty {
    return this._width;
  }

  public get heightProperty(): HeightProperty {
    return this._height;
  }

  public prepareConfig(): Promise<{ name: string; value: any }[]> {
    console.log("prepareConfig SourcesProperty", this._sources.value);
    return this._sources.save().then(() =>
      super.prepareConfig().then((config) => {
        console.log("config", config);
        return config;
      }),
    );
  }

  public htmlContent(): Promise<Blob> {
    return downloadFile(this._sources.value.html);
  }

  public cssContent(): Promise<Blob> {
    return downloadFile(this._sources.value.css);
  }

  public jsContent(): Promise<Blob> {
    return downloadFile(this._sources.value.js);
  }

  public configContent(): Promise<any> {
    return downloadFile(this._sources.value.config)
      .then((blob) => blob.text())
      .then((text) => {
        if (text) {
          return JSON.parse(text);
        }
      });
  }

  public help(): ReactNode {
    return (
      <>
        <Flex align="center" justify="space-between">
          <h3 className={`${classes.helptitle}`}>Виджет "Canvas"</h3>
          <CloseOverlayButton />
        </Flex>
        <div className={`${classes.helpdescription}`}>
          Виджет для группировки других виджетов внутри себя.
        </div>
        <h3 className={`${classes.helptitle}`}>Как подключить</h3>
        <div className={`${classes.helpdescription}`}>
          <ul>
            <li>В меню этого виджета (Canvas) скопировать ссылку.</li>
            <li>
              Вставить ссылку как Browser Source в OBS поверх картинки стрима.
            </li>
          </ul>
        </div>
      </>
    );
  }

  public hasDemo() {
    return true;
  }

  public demo() {
    return <CustomWidget store={new DemoCustomWidgetStore()} settings={this} />;
  }
}
