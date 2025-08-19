import { Alert } from "../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { log } from "../logging";
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

  public applyTo(
    settings:
      | { set: (name: string, value: any, asInitialValue: boolean) => void }
      | Alert,
    type: string,
  ) {
    Widget.createDefault(type)
      ?.prepareConfig()
      .forEach((prop) => {
        settings.set(prop.name, prop.value, false);
      });
    this._properties.forEach((prop) => {
      if (settings instanceof Alert) {
        if (prop.name === "image") {
          (settings as Alert).image = prop.value;
          log.debug({ image: prop.value }, "setting alert image");
          return;
        }
        if (prop.name === "audio") {
          (settings as Alert).audio = prop.value;
          log.debug({ audio: prop.value }, "setting alert audio");
          return;
        }
        if (prop.name === "video") {
          (settings as Alert).video = prop.value;
          log.debug({ video: prop.value }, "setting alert video");
          return;
        }
      }
      settings.set(prop.name, prop.value, false);
    });
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
