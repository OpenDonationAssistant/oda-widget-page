import { ReactNode } from "react";
import { WidgetProperty } from "./WidgetProperty";
import { AbstractWidgetSettings } from "../widgetsettings/AbstractWidgetSettings";
import { PresetStore } from "../../../stores/PresetStore";
import { Button, Flex } from "antd";
import { Image } from "antd";
import classes from "./PresetProperty.module.css";

export class PresetProperty implements WidgetProperty<string> {
  private _settings: AbstractWidgetSettings;
  private _store: PresetStore = new PresetStore();
  public name: string = "preset";
  public value: string = "";
  public displayName: string = "widget-preset";
  public changed: boolean = false;

  constructor({
    type,
    settings,
  }: {
    type: string;
    settings: AbstractWidgetSettings;
  }) {
    this.value = type;
    this._settings = settings;
  }

  markSaved: () => void = () => {};

  markup(): ReactNode {
    return (
      <>
        <div className={`${classes.guide}`}>
          Нажмите кнопку "Применить" под понравившимся шаблоном, чтобы
          скопировать все настройки с него в этот виджет. <br/>Все настройки можно
          поменять в соседних вкладках, а если хотите вернуть обратно, как было
          в шаблоне, - просто снова нажмите "Применить".
        </div>
        <Flex className={`${classes.grid}`} gap={10} wrap={true}>
          {this._store.for(this.value).map((preset) => (
            <Flex vertical={true} gap={10}>
              <Image.PreviewGroup>
                <Image
                  width={200}
                  height={120}
                  className={`${classes.preview}`}
                  src={preset.showcase}
                />
              </Image.PreviewGroup>
              <Button
                onClick={() => {
                  preset.applyTo(this._settings);
                }}
                className="oda-btn-default"
              >
                Применить
              </Button>
            </Flex>
          ))}
        </Flex>
      </>
    );
  }
}
