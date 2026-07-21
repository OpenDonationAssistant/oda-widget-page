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
  private _owner: string;

  constructor({
    name,
    owner,
    properties,
    showcase,
  }: {
    name: string;
    owner: string;
    properties: PresetProperty[];
    showcase: string;
  }) {
    this._name = name;
    this._properties = properties;
    this._showcase = showcase;
    this._owner = owner;
  }

  public async applyTo(
    settings:
      | { set: (name: string, value: any, asInitialValue: boolean) => void }
      | Alert,
    type: string,
  ) {
    if (settings instanceof Alert) {
      this._properties.forEach((prop) => {
        if (prop.name === "image") {
          (settings as Alert).image = prop.value;
          return;
        }
        if (prop.name === "audio") {
          (settings as Alert).audio = prop.value;
          return;
        }
        if (prop.name === "video") {
          (settings as Alert).video = prop.value;
          return;
        }
        settings.set(prop.name, prop.value, false);
      });
    } else {
      await Widget.createDefault(type)
        ?.prepareConfig()
        .then((props) => {
          props.forEach((prop) => {
            settings.set(prop.name, prop.value, false);
          });
        })
        .then(() => {
          this._properties.forEach((prop) => {
            settings.set(prop.name, prop.value, false);
          });
        });
    }
  }

  public get name(): string {
    return this._name;
  }

  public get showcase(): string {
    return this._showcase;
  }

  public get properties() {
    return this._properties;
  }

  public get owner(): string {
    return this._owner;
  }
}
