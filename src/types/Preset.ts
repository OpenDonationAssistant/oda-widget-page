import { AbstractWidgetSettings } from "../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { Alert } from "../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { Widget } from "../types/Widget";

interface PresetProperty {
  name: string;
  value: any;
}

export class Preset {
  private _name: string;
  private _showcase: string;
  private _properties: PresetProperty[];

  constructor({
    name,
    properties,
    showcase,
  }: {
    name: string;
    properties: PresetProperty[];
    showcase: string;
  }) {
    this._name = name;
    this._properties = properties;
    this._showcase = showcase;
  }

  public applyTo(settings: AbstractWidgetSettings | Alert, type: string) {
    Widget.createDefault(type)
      ?.prepareConfig()
      .forEach((prop) => {
        settings.set(prop.name, prop.value, false);
      });
    this._properties.forEach((prop) => {
      settings.set(prop.name, prop.value, false);
    });
  }

  public get name(): string {
    return this._name;
  }

  public get showcase(): string {
    return this._showcase;
  }
}
